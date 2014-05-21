package com.chattitude.client;
import android.content.Intent;
import android.util.Log;
import android.widget.LinearLayout;
import android.widget.TextView;


import com.chattitude.app.MainActivity;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Observable;

import io.socket.IOAcknowledge;
import io.socket.IOCallback;
import io.socket.SocketIOException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ChatCallback implements IOCallback, IOAcknowledge {
    private ChatCallbackAdapter callback;
    
    public ChatCallback(ChatCallbackAdapter callback) {
        this.callback = callback;
    }

	@Override
	public void ack(Object... data) {
        Log.d("QQQ", "ack");
        try {
			callback.callback(new JSONArray(Arrays.asList(data)));
		} catch (JSONException e) {
			e.printStackTrace();
		}
    }

    @Override
    public void on(String event, IOAcknowledge ack, Object... data) {



        Log.d("QQQ", "on event="+event);

        if (event.equals("user message"))
        {
            MainActivity.instance.addMessage((String)data[0], (String)data[1]);
            callback.onMessage((String)data[0], (String)data[1]);
        }
        else if (event.equals("announcement"))
        {
            callback.onMessage("", (String)data[0]);
            MainActivity.instance.addMessage("", (String)data[0]);

        }
        else if (event.equals("top"))
        {

        }
        else if (event.equals("update_rooms"))
        {

        }
        else if (event.equals("nicknames"))
        {
            callback.onNicknames((JSONObject) data[0]);
        }
        else
        {
            callback.on(event, (JSONObject) data[0]);

        }
    }


    @Override
    public void onMessage(String message, IOAcknowledge ack) {
        callback.onMessage(message);
    }

    @Override
    public void onMessage(JSONObject json, IOAcknowledge ack) {
        callback.onMessage(json);
    }

    @Override
    public void onConnect() {

        callback.onConnect();
        MainActivity.instance.showChat();


    }

    @Override
    public void onDisconnect() {
        callback.onDisconnect();
    }

	@Override
	public void onError(SocketIOException socketIOException) {
		socketIOException.printStackTrace();
        Log.d("QQQ", "onError: "+socketIOException.getStackTrace());
        callback.onConnectFailure();
	}

    
}
