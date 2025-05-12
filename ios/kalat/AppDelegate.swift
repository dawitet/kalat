import UIKit
import React
import React_RCTAppDelegate

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let appDelegate = RCTAppDelegate()
    return appDelegate.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
