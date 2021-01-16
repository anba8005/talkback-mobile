/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.talkback;

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

import static android.app.NotificationManager.INTERRUPTION_FILTER_NONE;

class NotificationHelper {
    static final String ERROR_INVALID_CONFIG = "ERROR_INVALID_CONFIG";
    static final String ERROR_SERVICE_ERROR = "ERROR_SERVICE_ERROR";
    static final String ERROR_ANDROID_VERSION = "ERROR_ANDROID_VERSION";

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
                    channelConfig.getInt("importance") : NotificationManager.IMPORTANCE_DEFAULT;
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

    Notification buildNotification(Context context, PendingIntent pendingIntent, ReadableMap notificationConfig) {
        if (notificationConfig == null) {
            Log.e("NotificationHelper", "buildNotification: invalid config");
            return null;
        }

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

        notificationBuilder.setContentTitle(notificationConfig.getString("title"))
                .setContentText(notificationConfig.getString("text"))
                .setOngoing(true)
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