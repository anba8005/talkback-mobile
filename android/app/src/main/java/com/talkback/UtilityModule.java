package com.talkback;

import android.app.Notification;
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
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.talkback.NotificationHelper;

import java.util.ArrayList;
import java.util.List;

import static com.talkback.NotificationHelper.ERROR_INVALID_CONFIG;

public class UtilityModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private MediaSession ms;

    UtilityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
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
    public void startMediaSession(ReadableMap notificationConfig,Promise promise) {
        stopMediaSession();
        try {
            createMediaSession();
            showNotification(notificationConfig);
            Log.i("MediaSession", "STARTED");
            promise.resolve(null);
        } catch (InterruptedException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void stopMediaSession() {
        if (ms != null) {
            hideNotification();
            ms.setActive(false);
            ms.release();
            ms = null;
            Log.i("MediaSession", "STOPPED");
        }
    }

    private void createMediaSession() throws InterruptedException {
        ms = new MediaSession(getReactApplicationContext(), getReactApplicationContext().getPackageName());
        ms.setActive(true);
        //
        ms.setCallback(new MediaSession.Callback() {
            @Override
            public boolean onMediaButtonEvent(Intent mediaButtonIntent) {
                KeyEvent event = (KeyEvent) mediaButtonIntent.getParcelableExtra(Intent.EXTRA_KEY_EVENT);
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
                    Log.i("MEDIASESSION", keyText + " -> " + keyCode);
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
    }

    @ReactMethod
    public void createNotificationChannel(ReadableMap channelConfig, Promise promise) {
        if (channelConfig == null) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: Channel config is invalid");
            return;
        }
        NotificationHelper.getInstance(getReactApplicationContext()).createNotificationChannel(channelConfig, promise);
    }

    private void showNotification(ReadableMap notificationConfig) {
        if (notificationConfig != null) {
            Notification notification = NotificationHelper.getInstance(getReactApplicationContext())
                    .buildNotification(getReactApplicationContext(), ms.getController().getSessionActivity(), notificationConfig);
            NotificationManagerCompat.from(getReactApplicationContext()).notify(1,notification);
        }
    }

    private void hideNotification() {
        NotificationManagerCompat.from(getReactApplicationContext()).cancel(1);
    }

    @Override
    public void onHostResume() {
        //
    }

    @Override
    public void onHostPause() {
        //
    }

    @Override
    public void onHostDestroy() {
        stopMediaSession();
        Log.i("MediaSession", "DESTROYED");
    }
}
