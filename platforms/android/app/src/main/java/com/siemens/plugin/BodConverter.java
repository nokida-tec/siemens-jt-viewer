package com.siemens.plugin;

import java.io.PrintStream;

public class BodConverter
{
  static
  {
    try
    {
      System.loadLibrary("Jt81");
    }
    catch (UnsatisfiedLinkError localUnsatisfiedLinkError10)
    {
      System.out.println("FAILED to load Jt81");
      try
      {
        System.loadLibrary("JtBrep81");
      }
      catch (UnsatisfiedLinkError localUnsatisfiedLinkError11)
      {
        System.out.println("FAILED to load JtBrep81");
        try
        {
          System.loadLibrary("JtXTBrep81");
        }
        catch (UnsatisfiedLinkError localUnsatisfiedLinkError12)
        {
          System.out.println("FAILED to load JtXTBrep81");
          try
          {
            System.loadLibrary("JtSimp81");
          }
          catch (UnsatisfiedLinkError localUnsatisfiedLinkError13)
          {
            System.out.println("FAILED to load JtSimp81");
            try
            {
              System.loadLibrary("JtLibra81");
            }
            catch (UnsatisfiedLinkError localUnsatisfiedLinkError14)
            {
              System.out.println("FAILED to load JtLibra81");
              try
              {
                System.loadLibrary("JtSupt81");
              }
              catch (UnsatisfiedLinkError localUnsatisfiedLinkError15)
              {
                System.out.println("FAILED to load JtSupt81");
                try
                {
                  System.loadLibrary("pskernel");
                }
                catch (UnsatisfiedLinkError localUnsatisfiedLinkError16)
                {
                  System.out.println("FAILED to load pskernel");
                  try
                  {
                    System.loadLibrary("psbodyshop");
                  }
                  catch (UnsatisfiedLinkError localUnsatisfiedLinkError17)
                  {
                    System.out.println("FAILED to load psbodyshop");
                    try
                    {
                      System.loadLibrary("psxttoolkit");
                    }
                    catch (UnsatisfiedLinkError localUnsatisfiedLinkError18)
                    {
                      System.out.println("FAILED to load psxttoolkit");
                      try
                      {
                        System.loadLibrary("JtTk83");
                      }
                      catch (UnsatisfiedLinkError localUnsatisfiedLinkError19)
                      {
                        System.out.println("FAILED to load JtTk83");
                        try
                        {
                            System.loadLibrary("jt2bod");
                            try
                            {
                              System.loadLibrary("plmBodConverter-jni");
                            }
                            catch (UnsatisfiedLinkError localUnsatisfiedLinkError20)
                            {
                              System.out.println("FAILED to load plmBodConverter-jni");
                            }
                        }
                        catch (UnsatisfiedLinkError localUnsatisfiedLinkError21)
                        {
                            System.out.println("FAILED to load jt2bod");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  public static native boolean convertToBods(String paramString1, String fileName);
  
  public static native String[] convertToStrings(String paramString);
  
  public static native void fini();
  
  public static native String init();
}

