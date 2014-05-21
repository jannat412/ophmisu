package com.chattitude.client;

import android.util.Log;

import io.socket.SocketIO;

import java.net.MalformedURLException;
import org.json.JSONException;
import org.json.JSONObject;

public class Chat extends Thread {
    private SocketIO socket;
    public ChatCallback callback;
    public Boolean running = false;
    public Chat(ChatCallbackAdapter callback) {
        this.callback = new ChatCallback(callback);
    }
    
    @Override
    public void run() {
        this.running = true;
        try {
			socket = new SocketIO("http://trivia.play.ai:2013", callback);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}

        Log.d("QQQ", "Chat run END");

    }

    
    public void sendMessage(String message) {
        try {
            JSONObject json = new JSONObject();
            json.putOpt("message", message);
            Log.d("QQQ", "send message data=" + json.toString());
            socket.emit("user message", json);
        } catch (JSONException ex) {
            ex.printStackTrace();
        }
    }
    
    public void join(String nickname) {
        try {
            JSONObject json = new JSONObject();
            json.putOpt("nickname", nickname);
            Log.d("QQQ", "join data=" + json.toString());
            socket.emit("nickname", callback, json);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    public void disconnect()
    {
        if (this.socket != null)
            this.socket.disconnect();
    }
}
