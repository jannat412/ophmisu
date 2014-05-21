package com.chattitude.client;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.MalformedURLException;

import io.socket.IOAcknowledge;
import io.socket.SocketIO;
import io.socket.SocketIOException;

/**
 * Created by WSergio on 5/18/2014.
 */
public class ChatApp implements ChatCallbackAdapter {
    public Chat chat;
    public String nickname = "Stranger-"+Utils.randInt(1,9999);

    public ChatApp()
    {
        chat = new Chat(this);
    }
    @Override
    public void callback(JSONArray data) throws JSONException {
        Log.d("QQQ", "callback data="+data.toString());
    }



    @Override
    public void on(String event, JSONObject data) {
        Log.d("QQQ", "on event="+event+" data="+data.toString());
    }

    @Override
    public void onMessage(String message) {
        Log.d("QQQ", "onMessage "+message);
    }

    @Override
    public void onMessage(String sender, String message) {
        Log.d("QQQ", "onMessage From: "+sender+" Message: "+message);
    }

    @Override
    public void onMessage(JSONObject json) {
        Log.d("QQQ", "onMessage J "+json.toString());
    }

    @Override
    public void onConnect() {
        Log.d("QQQ", "onConnect ");
        chat.running = true;
        chat.join(this.nickname);
        chat.sendMessage("Hello from Android!");
    }


    @Override
    public void onDisconnect() {
        Log.d("QQQ", "onDisconnect ");
    }

    @Override
    public void onConnectFailure() {
        Log.d("QQQ", "onConnectFailure ");
    }

    @Override
    public void onNicknames(JSONObject object) {
        Log.d("QQQ", "Nicknames #"+object.length()+" : "+object.toString());

    }
}
