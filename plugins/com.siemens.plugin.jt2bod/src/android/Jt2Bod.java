package com.siemens.plugin;

import android.app.Activity;
import java.io.File;
import java.util.Arrays;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class Jt2Bod
  extends CordovaPlugin
{
  void deleteRecursive(File paramFile)
  {
    if (paramFile.isDirectory())
    {
      File[] subFiles = paramFile.listFiles();
      for (File subFile : subFiles)
      {
        if (!subFile.isDirectory()) {
          subFile.delete();
        } else {
          deleteRecursive(subFile);
        }
      }
    }
  }
  
  public boolean execute(String action, JSONArray paramJSONArray, CallbackContext paramCallbackContext)
    throws JSONException
  {
    this.cordova.getActivity().getApplicationContext();
    if (action.equals("convert"))
    {
      String[] strings = BodConverter.convertToStrings(paramJSONArray.getString(0));
      if ((strings != null) && (strings.length > 1)) {
        try
        {
          paramCallbackContext.success(new JSONArray(Arrays.asList(strings)));
          return true;
        }
        catch (Throwable throwable)
        {
          paramCallbackContext.error(throwable.getMessage());
          return false;
        }
      }
      if ((strings != null) && (strings.length == 1))
      {
        paramCallbackContext.error(strings[0]);
        return false;
      }
      paramCallbackContext.error("Failure on converting jt to base64 strings.");
      return false;
    }
    if (action.equals("convertToBods"))
    {
      String source = paramJSONArray.getString(0);
      String target = paramJSONArray.getString(1);
      File localFile = new File(target);
      if (!localFile.exists()) {
        localFile.mkdir();
      }
      deleteRecursive(localFile.getParentFile());
      if (!localFile.exists()) {
        localFile.mkdir();
      }
      if (BodConverter.convertToBods(source, target))
      {
        paramCallbackContext.success();
        return true;
      }
      paramCallbackContext.error("Failure on converting jt to bod files.");
      return false;
    }
    if (action.equals("init"))
    {
      paramCallbackContext.success(BodConverter.init());
      return true;
    }
    if (action.equals("fini"))
    {
      BodConverter.fini();
      paramCallbackContext.success();
      return true;
    }
    paramCallbackContext.error("Invalid action: " + action);
    return false;
  }
}

