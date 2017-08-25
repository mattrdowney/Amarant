#pragma strict

var trans : Transform;

var game_Obj : GameObject;

function Start ()
	{
	game_Obj = GameObject.Find("/Player/Camera");
	trans = game_Obj.GetComponent(Transform);
	game_Obj = GameObject.Find("/Player/Camera/SubCamera");
	}

function Update ()
	{
	if(Input.GetButtonDown("Fire1"))
		{
		var hit : RaycastHit;
		Physics.Raycast(trans.position,trans.forward,hit,100);
		if(hit.collider && hit.collider.tag)
			{
			game_Obj.SendMessage("DIE");
			}
		}
	}