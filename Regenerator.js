#pragma strict

var myRenderTexture : RenderTexture;
var myTexture2D : Texture2D;

var trans : Transform;
var cam : Camera;

var objects : GameObject[]; 
var shaders : Shader[];
var colors : Color[];

var dead : boolean = false; //dead yet?

var rez_time : float = 3;
var rez_timer : float = 0;

var k : Shader;
var w : Shader;

function Start ()
	{
	var gameObj : GameObject;
	gameObj = GameObject.Find("/E_Var2");
	trans = gameObj.GetComponent(Transform);
	gameObj = GameObject.Find("/Player/Camera/SubCamera");
	cam = gameObj.GetComponent(Camera);
	k = Shader.Find("MyShaders/Black");
	w = Shader.Find("MyShaders/White");
	//myRenderTexture = new RenderTexture(Screen.width,Screen.height,32);
	myTexture2D = new Texture2D(myRenderTexture.width,myRenderTexture.height);
	RenderTexture.active = myRenderTexture;	
	}

function OnPreRender ()
	{
	objects = GameObject.FindSceneObjectsOfType(typeof(GameObject));
	shaders = new Shader[objects.length];
	
	var i : int;
	i = 0;
	for(obj in objects)
		{
		if(obj.renderer)
			{
			shaders[i] = obj.renderer.material.shader;
			if(obj.tag != "Zenemy") obj.renderer.material.shader = k;
			else obj.renderer.material.shader = w;
			}
		i++;
		}
	}

function OnPostRender ()
	{
	var i : int;
	i = 0;
	for(obj in objects)
		{
		if(obj.renderer) obj.renderer.material.shader = shaders[i];
		i++;
		}
	RenderTexture.active = myRenderTexture;
	myTexture2D.ReadPixels(new Rect(0, 0, myRenderTexture.width-1, myRenderTexture.height-1), 0, 0, false);
	myTexture2D.Apply();
	colors = myTexture2D.GetPixels();
	var thisGuyShouldMothaFuckingResurrect : boolean = true; //spelling is important on long names
	for(color in colors)
		{
		if(!Mathf.Approximately(color.grayscale,0))
			{
			thisGuyShouldMothaFuckingResurrect = false;
			break;
			}
		}
	if(dead && thisGuyShouldMothaFuckingResurrect) Resurrect();
	else if(dead) Decay();
	}

function DIE ()
	{
	trans.eulerAngles.z = 90;
	rez_timer = 0;
	if(!dead)
		{
		dead = true;
		Debug.Log(Time.time);
		}
	}
	
function Resurrect ()
	{
	rez_timer += Time.deltaTime;
	if(rez_timer > rez_time)
		{
		rez_timer = rez_time;
		dead = false;
		}
	trans.eulerAngles.z = 90 - 30*rez_timer;
	}
	
function Decay ()
	{
	rez_timer -= Time.deltaTime;
	if(rez_timer < 0)
		{
		rez_timer = 0;
		dead = true;
		}
	trans.eulerAngles.z = 90 - 30*rez_timer;
	}