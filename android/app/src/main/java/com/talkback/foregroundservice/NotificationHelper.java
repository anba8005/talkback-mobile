/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.talkback.foregroundservice;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.talkback.MainActivity;

import static android.app.NotificationManager.INTERRUPTION_FILTER_NONE;
import static com.talkback.foregroundservice.Constants.ERROR_ANDROID_VERSION;
import static com.talkback.foregroundservice.Constants.ERROR_INVALID_CONFIG;

class NotificationHelper {
    private static NotificationHelper instance = null;
    private NotificationManager mNotificationManager;
    private Integer mLastInterruptionFilter;

    public static synchronized NotificationHelper getInstance(Context context) {
        if (instance == null) {
            instance = new NotificationHelper(context);
        }
        return instance;
    }

    private NotificationHelper(Context context) {
        mNotificationManager = (NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            mLastInterruptionFilter = mNotificationManager.getCurrentInterruptionFilter();
        }

    }

    void createNotificationChannel(ReadableMap channelConfig, Promise promise) {
        if (channelConfig == null) {
            Log.e("NotificationHelper", "createNotificationChannel: invalid config");
            promise.reject(ERROR_INVALID_CONFIG, "VIForegroundService: Channel config is invalid");
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!channelConfig.hasKey("id")) {
                promise.reject(ERROR_INVALID_CONFIG, "VIForegroundService: Channel id is required");
                return;
            }
            String channelId = channelConfig.getString("id");
            if (!channelConfig.hasKey("name")) {
                promise.reject(ERROR_INVALID_CONFIG, "VIForegroundService: Channel name is required");
                return;
            }
            String channelName = channelConfig.getString("name");
            String channelDescription = channelConfig.getString("description");
            int channelImportance = channelConfig.hasKey("importance") ?
                    channelConfig.getInt("importance") : NotificationManager.IMPORTANCE_LOW;
            boolean enableVibration = channelConfig.hasKey("enableVibration") && channelConfig.getBoolean("enableVibration");
            if (channelId == null || channelName == null) {
                promise.reject(ERROR_INVALID_CONFIG, "VIForegroundService: Channel id or name is not specified");
                return;
            }
            NotificationChannel channel = new NotificationChannel(channelId, channelName, channelImportance);
            channel.setDescription(channelDescription);
            channel.enableVibration(enableVibration);
            mNotificationManager.createNotificationChannel(channel);
            promise.resolve(null);
        } else {
            promise.reject(ERROR_ANDROID_VERSION, "VIForegroundService: Notification channel can be created on Android O+");
        }
    }

    Notification buildNotification(Context context, Bundle notificationConfig) {
        if (notificationConfig == null) {
            Log.e("NotificationHelper", "buildNotification: invalid config");
            return null;
        }

        Intent notificationIntent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, 0);

        Notification.Builder notificationBuilder;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = notificationConfig.getString("channelId");
            if (channelId == null) {
                Log.e("NotificationHelper", "buildNotification: invalid channelId");
                return null;
            }
            notificationBuilder = new Notification.Builder(context, channelId);
        } else {
            notificationBuilder = new Notification.Builder(context);
        }

        int priorityInt = notificationConfig.containsKey("priority") ? notificationConfig.getInt("priority"): Notification.PRIORITY_HIGH;

        int priority;
        switch (priorityInt) {
            case 0:
                priority = Notification.PRIORITY_DEFAULT;
                break;
            case -1:
                priority = Notification.PRIORITY_LOW;
                break;
            case -2:
                priority = Notification.PRIORITY_MIN;
                break;
            case 1:
                priority = Notification.PRIORITY_HIGH;
                break;
            case 2:
                priority = Notification.PRIORITY_MAX;
                break;
            default:
                priority = Notification.PRIORITY_HIGH;
                break;

        }

        notificationBuilder.setContentTitle(notificationConfig.getString("title"))
                .setContentText(notificationConfig.getString("text"))
                .setPriority(priority)
                .setContentIntent(pendingIntent);

        String iconName = notificationConfig.getString("icon");
        if (iconName != null) {
            notificationBuilder.setSmallIcon(getResourceIdForResourceName(context, iconName));
        }

        return notificationBuilder.build();
    }

    void enableDND() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (mNotificationManager.isNotificationPolicyAccessGranted()) {
                mNotificationManager.setInterruptionFilter(INTERRUPTION_FILTER_NONE);
            }
        }
    }

    void resetDND() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (mNotificationManager.isNotificationPolicyAccessGranted()) {
                mNotificationManager.setInterruptionFilter((mLastInterruptionFilter));
            }
        }
    }

    boolean isDNDPermissionGranted() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return mNotificationManager.isNotificationPolicyAccessGranted();
        } else {
            return true; // tikrai true :)
        }
    }

    private int getResourceIdForResourceName(Context context, String resourceName) {
        int resourceId = context.getResources().getIdentifier(resourceName, "drawable", context.getPackageName());
        if (resourceId == 0) {
            resourceId = context.getResources().getIdentifier(resourceName, "mipmap", context.getPackageName());
        }
        return resourceId;
    }
}