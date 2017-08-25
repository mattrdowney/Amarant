using UnityEngine;
using System.Collections;

public class Regen : MonoBehaviour
{
	public RenderTexture myRenderTexture;
	Texture2D myTexture2D;

	Transform trans;
	Camera cam;
	
	public GameObject[] objects;
	public Shader[] shaders;
	private Color[] colors;

	bool dead = false; //dead yet?
	
	float this_counts;
	float rez_time;
	float rez_timer;

	Shader k;
	Shader w;

	void Start ()
	{
		this_counts = 0f;
		rez_time = 3f;
		rez_timer = 0f;
		myRenderTexture.width = Screen.width;
		myRenderTexture.height = Screen.height;
		myRenderTexture.filterMode = FilterMode.Point;
		GameObject gameObj;
		gameObj = GameObject.Find("/Mia");
		trans = gameObj.GetComponent<Transform>();
		gameObj = GameObject.Find("/Player/Camera/SubCamera");
		cam = gameObj.camera;
		cam.targetTexture = myRenderTexture;
		k = Shader.Find("MyShaders/Black");
		w = Shader.Find("MyShaders/White");
		myTexture2D = new Texture2D(Screen.width,Screen.height);
		objects = FindObjectsOfType(typeof(GameObject)) as GameObject[];
		shaders = new Shader[objects.Length];
	
		int i = 0;
		foreach(GameObject obj in objects)
		{
			if(obj.renderer)
			{
				shaders[i] = obj.renderer.material.shader;
			}
		i++;
		}
		RenderTexture.active = myRenderTexture;
	}

	void OnPreRender ()
	{
  		int i = 0;
		foreach(GameObject obj in objects)
		{
			if(obj.renderer)
			{
				if(obj.tag != "Zenemy") obj.renderer.material.shader = k;
				else obj.renderer.material.shader = w;
			}
			i++;
		}
	}

	void OnPostRender ()
	{
		int i = 0;
		foreach(GameObject obj in objects)
		{
			if(obj.renderer) obj.renderer.material.shader = shaders[i];
			i++;
		}
		myTexture2D.ReadPixels(new Rect(0, 0,myRenderTexture.width,myRenderTexture.height), 0, 0, false);
		colors = myTexture2D.GetPixels();
		bool thisGuyShouldMothaFuckingResurrect = true; //spelling is important on long names
		this_counts = 0f;
		foreach(Color color in colors)
		{
			this_counts += color.r;
		}
		Debug.Log(this_counts);
		if(this_counts != 0f)
		{
			thisGuyShouldMothaFuckingResurrect = false;
		}
		if(dead && thisGuyShouldMothaFuckingResurrect) Resurrect();
		else if(dead) Decay();
	}

	void DIE ()
	{
		trans.eulerAngles = new Vector3(-90f,-360f,-360f);
		rez_timer = 0f;
		if(!dead)
		{
			dead = true;
			Debug.Log(Time.time);
		}
	}
	
	void Resurrect ()
	{
		rez_timer += Time.deltaTime;
		if(rez_timer > rez_time)
		{
			rez_timer = rez_time;
			dead = false;
		}
		trans.eulerAngles = new Vector3(-90f + 30f*rez_timer,-360f,-360f);
	}
	
	void Decay ()
	{
		rez_timer -= Time.deltaTime;
		if(rez_timer < 0f)
		{
			rez_timer = 0f;
			dead = true;
		}
		trans.eulerAngles = new Vector3(-90f + 30f*rez_timer,-360f,-360f);
	}
	
}
