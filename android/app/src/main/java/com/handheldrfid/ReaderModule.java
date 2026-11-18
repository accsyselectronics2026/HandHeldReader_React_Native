package com.handheldrfid;
import androidx.annotation.NonNull;

import android.os.AsyncTask;
import android.util.Log;


import android.hardware.input.InputManager;
import android.os.Handler;
import android.os.Looper;
import android.view.InputDevice;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;


import android.content.Context; 
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;
import androidx.fragment.app.FragmentActivity;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import android.app.ProgressDialog;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;


import androidx.fragment.app.FragmentActivity;
import com.rscja.utility.StringUtility;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


import com.rscja.deviceapi.RFIDWithUHFUART;
import com.rscja.deviceapi.entity.UHFTAGInfo;
import com.rscja.scanner.IScanner;
import com.rscja.scanner.utility.ScannerUtility;
import com.rscja.deviceapi.interfaces.KeyEventCallback;



public class ReaderModule extends ReactContextBaseJavaModule  {
    private ArrayList<HashMap<String, String>> tagList = null;
	 private boolean loopFlag = false;

	private List<String> scannedTags = new ArrayList<String>();
    public static final String EVENT_SCAN_KEY_PRESSED = "onScanKeyPressed";
    public RFIDWithUHFUART mReader;

	// public RFIDWithUHFUART mReader;

	private ReactContext reactContext;

    ReaderModule(ReactApplicationContext reactContext) {
		super(reactContext);
		this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ReaderModule";
    }


	public void initUHF() {
		try {
			mReader = RFIDWithUHFUART.getInstance();
		} catch (Exception ex) {
			// toastMessage(ex.getMessage());
			return;
		}

		if (mReader != null) {
			new InitTask().execute();
		}
	}


    public class InitTask extends AsyncTask<String, Integer, Boolean> {
		protected Boolean doInBackground(String... params) {
			mReader.free();
			return mReader.init();
		}
		protected void onPostExecute(Boolean result) {
			super.onPostExecute(result);
			if (!result) {
			}
		}
		protected void onPreExecute() {
			super.onPreExecute();
		}
	}

	public void sendDataToJS1(String data) {
		// Access the ReactContext and send event to JavaScript
		getReactApplicationContext()
				.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
				.emit("DataFromNative", data);
	}


	public String getUHFVersion() {
		if(mReader!=null) {
			String rfidVer = mReader.getVersion();
			return rfidVer;
		}
		return "";
	}


  @ReactMethod
  public void sendDataToJS(String data) {
        // Access the ReactContext and send event to JavaScript
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("DataFromNative", data);
    }

    @ReactMethod
    public void uhfreaderinit() {
        initUHF();
    }


    @ReactMethod
    public void getSingleTag(String name , Callback callback) {
//		String message = getUHFVersion();
		UHFTAGInfo uhftagInfo  = mReader.inventorySingleTag();

		if (uhftagInfo != null) {
			String message = uhftagInfo.getEPC();
			callback.invoke(message);
		 }else{
			callback.invoke("NO TAG");
		 }
    }

    @ReactMethod
    public void StartInventory() {
		if (mReader.startInventoryTag()) {
			loopFlag = true;
			new TagThread().start();
		} else {
			stopInventory();
		}
	}

 	@ReactMethod
	 private void stopInventory() {
        if (loopFlag) {
            loopFlag = false;
            if (mReader.stopInventory()) {
            } else {
            }
        }
    }


  class TagThread extends Thread {
        public void run() {
            UHFTAGInfo uhftagInfo;
            while (loopFlag) {
                uhftagInfo = mReader.readTagFromBuffer();
                if (uhftagInfo != null) {
                  	String message = uhftagInfo.getEPC();
					   getReactApplicationContext()
						.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
						.emit("DataFromNative", message);
                }
            }
        }
    }







}



