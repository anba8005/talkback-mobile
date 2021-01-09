/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.talkback.foregroundservice;

import android.content.ComponentName;
import android.content.Intent;
import android.os.Build;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.LifecycleEventListener;

import static com.talkback.foregroundservice.Constants.ERROR_INVALID_CONFIG;
import static com.talkback.foregroundservice.Constants.ERROR_SERVICE_ERROR;
import static com.talkback.foregroundservice.Constants.NOTIFICATION_CONFIG;

public class ForegroundServiceModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;
    private boolean killOnDestroy;

    public ForegroundServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.killOnDestroy = false;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "ForegroundService";
    }

    @ReactMethod
    public void createNotificationChannel(ReadableMap channelConfig, Promise promise) {
        if (channelConfig == null) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: Channel config is invalid");
            return;
        }
        NotificationHelper.getInstance(getReactApplicationContext()).createNotificationChannel(channelConfig, promise);
    }

    @ReactMethod
    public void startService(ReadableMap notificationConfig, Promise promise) {
        if (notificationConfig == null) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: Notification config is invalid");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!notificationConfig.hasKey("channelId")) {
                promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: channelId is required");
                return;
            }
        }

        if (!notificationConfig.hasKey("id")) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: id is required");
            return;
        }

        if (!notificationConfig.hasKey("icon")) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: icon is required");
            return;
        }

        if (!notificationConfig.hasKey("title")) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: title is reqired");
            return;
        }

        if (!notificationConfig.hasKey("text")) {
            promise.reject(ERROR_INVALID_CONFIG, "ForegroundService: text is required");
            return;
        }

        if (notificationConfig.hasKey("killOnDestroy")) {
            this.killOnDestroy = notificationConfig.getBoolean("killOnDestroy");
        }

        Intent intent = new Intent(getReactApplicationContext(), ForegroundService.class);
        intent.setAction(Constants.ACTION_FOREGROUND_SERVICE_START);
        intent.putExtra(NOTIFICATION_CONFIG, Arguments.toBundle(notificationConfig));
        ComponentName componentName = getReactApplicationContext().startService(intent);
        if (componentName != null) {
            promise.resolve(null);
        } else {
            promise.reject(ERROR_SERVICE_ERROR, "ForegroundService: Foreground service is not started");
        }
    }

    @ReactMethod
    public void stopService(Promise promise) {
        Intent intent = new Intent(getReactApplicationContext(), ForegroundService.class);
        intent.setAction(Constants.ACTION_FOREGROUND_SERVICE_STOP);
        boolean stopped = getReactApplicationContext().stopService(intent);
        if (stopped) {
            promise.resolve(null);
        } else {
            promise.reject(ERROR_SERVICE_ERROR, "ForegroundService: Foreground service failed to stop");
        }
    }

    @ReactMethod
    public void enableDND() {
        NotificationHelper helper = NotificationHelper.getInstance(getReactApplicationContext()
                .getApplicationContext());
    	helper.enableDND();
    }

    @ReactMethod
    public void resetDND() {
        NotificationHelper helper = NotificationHelper.getInstance(getReactApplicationContext()
                .getApplicationContext());
        helper.resetDND();
    }

	@ReactMethod
	public void requestDNDPermission() {
		// incomplete - todo return with activity result
		// https://github.com/facebook/react-native/issues/3334
        NotificationHelper helper = NotificationHelper.getInstance(getReactApplicationContext()
               .getApplicationContext());
		if (!helper.isDNDPermissionGranted()) {
            Intent intent = new Intent(android.provider.Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
            getCurrentActivity().startActivity(intent);
        }
	}


    @Override
    public void onHostResume() {
        // Activity `onResume`
    }

    @Override
    public void onHostPause() {
        // Activity `onPause`
    }

    @Override
    public void onHostDestroy() {
        if (this.killOnDestroy) {
            Intent intent = new Intent(getReactApplicationContext(), ForegroundService.class);
            intent.setAction(Constants.ACTION_FOREGROUND_SERVICE_STOP);
            getReactApplicationContext().stopService(intent);
        }

    }
}