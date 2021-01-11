package com.talkback;

import android.content.Intent;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.media.MediaCodecInfo;
import android.media.MediaCodecList;
import android.media.session.MediaSession;
import android.os.Build;
import android.util.Log;
import android.view.KeyEvent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.List;

public class UtilityModule extends ReactContextBaseJavaModule {
    private MediaSession ms;

    UtilityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "Utility";
    }

    @ReactMethod
    public void exit() {
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    @ReactMethod
    public void startMediaSession() {
        stopMediaSession();
        try {
            Log.e("MEDIASESSION", "Starting session");
            createMediaSession();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void stopMediaSession() {
        if (ms != null) {
            Log.e("MEDIASESSION", "Stopping session");
            ms.setActive(false);
            ms.release();
            ms = null;
        }
    }

    private void createMediaSession() throws InterruptedException {
        ms = new MediaSession(getReactApplicationContext(), getReactApplicationContext().getPackageName());
        ms.setActive(true);
        ms.setCallback(new MediaSession.Callback() {
            @Override
            public boolean onMediaButtonEvent(Intent mediaButtonIntent) {
                KeyEvent event = (KeyEvent)mediaButtonIntent.getParcelableExtra(Intent.EXTRA_KEY_EVENT);
                if (event.getAction() == KeyEvent.ACTION_DOWN) {
                    int keyCode = event.getKeyCode();
                    String keyText = "";
                    switch (keyCode) {
                        case KeyEvent.KEYCODE_MEDIA_PLAY:
                            keyText = "KEYCODE_MEDIA_PLAY";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_PAUSE:
                            keyText = "KEYCODE_MEDIA_PAUSE";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
                            keyText = "KEYCODE_MEDIA_PLAY_PAUSE";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_NEXT:
                            keyText = "KEYCODE_MEDIA_NEXT";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_PREVIOUS:
                            keyText = "KEYCODE_MEDIA_PREVIOUS";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_CLOSE:
                            keyText = "KEYCODE_MEDIA_CLOSE";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_EJECT:
                            keyText = "KEYCODE_MEDIA_EJECT";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_RECORD:
                            keyText = "KEYCODE_MEDIA_RECORD";
                            break;
                        case KeyEvent.KEYCODE_MEDIA_STOP:
                            keyText = "KEYCODE_MEDIA_STOP";
                            break;
                        default:
                            keyText = "KEYCODE_UNKNOW";
                            break;
                    }
                    Log.e("MEDIASESSION", keyText + " -> " + keyCode);
                    WritableMap data = Arguments.createMap();
                    data.putString("eventText", keyText);
                    data.putInt("eventCode", keyCode);
                    getReactApplicationContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("NativeMediaButton", data);
                }
                return true;
            }
        });

        // play dummy audio
//        AudioTrack at = new AudioTrack(AudioManager.STREAM_MUSIC, 48000, AudioFormat.CHANNEL_OUT_STEREO, AudioFormat.ENCODING_PCM_16BIT,
//                AudioTrack.getMinBufferSize(48000, AudioFormat.CHANNEL_OUT_STEREO, AudioFormat.ENCODING_PCM_16BIT), AudioTrack.MODE_STREAM);
//        at.play();
//
//        // a little sleep
//        at.stop();
//        at.release();
    }

}
