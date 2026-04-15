export interface TutorialStep {
  title: string;
  description: string;
  tip?: string;
}

export interface Tutorial {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  androidSteps: TutorialStep[];
  appleSteps: TutorialStep[];
}

export const tutorials: Tutorial[] = [
  {
    id: "whatsapp",
    icon: "message-circle",
    title: "Install WhatsApp",
    description: "Learn how to download and set up WhatsApp to message your family and friends",
    badge: "Popular",
    androidSteps: [
      {
        title: "Open the Google Play Store",
        description:
          'Look for the colorful triangle icon on your home screen or in your apps. It may say "Play Store" underneath it. Tap it once to open.',
        tip: 'The Play Store icon looks like a colorful triangle pointing to the right.',
      },
      {
        title: "Search for WhatsApp",
        description:
          'At the top of the screen, you will see a search bar that says "Search for apps & games". Tap it and then type the word "WhatsApp" using your keyboard.',
        tip: "If you make a typo, tap the X on the right side of the search bar to clear it and try again.",
      },
      {
        title: "Find WhatsApp in the results",
        description:
          'A list of apps will appear. Look for "WhatsApp Messenger" — it has a green icon with a white phone inside. It is usually the very first result.',
      },
      {
        title: "Tap Install",
        description:
          'Tap on WhatsApp Messenger, then tap the green "Install" button. The app will start downloading automatically. This may take a minute or two.',
        tip: "Make sure you are connected to Wi-Fi to save your mobile data.",
      },
      {
        title: "Open WhatsApp",
        description:
          'Once it has finished downloading, tap the "Open" button. WhatsApp will start up for the first time.',
      },
      {
        title: "Accept the terms",
        description:
          'WhatsApp will show you some terms and conditions. Tap "Agree and Continue" at the bottom of the screen.',
      },
      {
        title: "Enter your phone number",
        description:
          "Type in your mobile phone number — the same number people already call you on. Make sure to include your country code if asked.",
        tip: "Double-check your number before continuing — WhatsApp will send a verification code to this number.",
      },
      {
        title: "Enter the verification code",
        description:
          "WhatsApp will send a 6-digit code to your phone by text message. Open the text message and type that code into WhatsApp. Sometimes WhatsApp detects it automatically!",
      },
      {
        title: "Set up your profile",
        description:
          "Type your name so your family and friends know who you are. You can also add a photo by tapping the circle. Then tap \"Next\".",
      },
      {
        title: "You are all set!",
        description:
          "WhatsApp is now installed and ready to use! You can find it on your home screen. Tap the green chat bubble icon to start a conversation.",
        tip: "Your contacts who also use WhatsApp will appear automatically in your contact list.",
      },
    ],
    appleSteps: [
      {
        title: "Open the App Store",
        description:
          'Look for the blue icon with a white letter "A" on your home screen. Tap it once to open the App Store.',
        tip: 'The App Store icon is bright blue with a white letter "A" made of sticks.',
      },
      {
        title: "Go to Search",
        description:
          'At the bottom of the screen, you will see a row of icons. Tap the magnifying glass icon that says "Search".',
      },
      {
        title: "Search for WhatsApp",
        description:
          'You will see a search bar at the top. Tap it and type "WhatsApp". Then tap the blue "Search" button on your keyboard.',
      },
      {
        title: "Find WhatsApp",
        description:
          'Look for "WhatsApp Messenger" in the results — it has a green icon with a white phone. Tap on it to see more details.',
      },
      {
        title: "Tap Get to download",
        description:
          'You will see a blue "GET" button next to WhatsApp. Tap it. You may be asked to confirm with your Face ID, fingerprint, or Apple ID password.',
        tip: "WhatsApp is completely free — you won't be charged anything.",
      },
      {
        title: "Wait for it to install",
        description:
          "A circle will show you how the download is going. When it stops spinning, WhatsApp is installed! You will now see it on your home screen.",
      },
      {
        title: "Open WhatsApp",
        description:
          "Tap the green WhatsApp icon on your home screen. It will open for the first time.",
      },
      {
        title: "Agree and Continue",
        description:
          'WhatsApp will ask you to accept its terms. Tap "Agree and Continue" at the bottom.',
      },
      {
        title: "Enter your phone number",
        description:
          "Type in your mobile phone number. Make sure it is the correct number — WhatsApp will send you a text message to verify it.",
        tip: "Use the same phone number that your family and friends already have for you.",
      },
      {
        title: "Enter the verification code",
        description:
          "Check your text messages — you should receive a 6-digit code from WhatsApp. Type this code in. WhatsApp may detect it automatically.",
      },
      {
        title: "Add your name and photo",
        description:
          'Type your first and last name so people recognise you. Tap "Next" when done. You can add a photo now or later.',
      },
      {
        title: "You are all done!",
        description:
          "WhatsApp is now set up on your iPhone! Tap on any contact in the list to start chatting. It's that simple.",
        tip: "Family and friends who already have WhatsApp will appear in your chat list automatically.",
      },
    ],
  },
  {
    id: "wifi",
    icon: "wifi",
    title: "Connect to Wi-Fi",
    description: "Learn how to connect your phone to your home internet to avoid using mobile data",
    androidSteps: [
      {
        title: "Open Settings",
        description:
          'Find the Settings app on your phone — it looks like a gear or cog wheel. Tap it to open.',
        tip: "Settings is usually in your app drawer or on your home screen.",
      },
      {
        title: "Tap on Wi-Fi or Network",
        description:
          "In the Settings menu, look for \"Wi-Fi\" or \"Connections\" or \"Network & Internet\". The exact name depends on your phone model. Tap on it.",
      },
      {
        title: "Turn on Wi-Fi",
        description:
          "You will see a switch or toggle at the top. If it is grey, tap it to turn Wi-Fi on. It will turn blue or green when it is on.",
      },
      {
        title: "Choose your Wi-Fi network",
        description:
          "A list of available Wi-Fi networks will appear. Look for the name of your home Wi-Fi network and tap on it.",
        tip: "Your Wi-Fi network name is usually on a sticker on your internet router.",
      },
      {
        title: "Enter your Wi-Fi password",
        description:
          "You will be asked to type in your password. This is usually on the sticker on your router. Type it carefully — passwords are case sensitive.",
        tip: "Tap the eye icon to show the password as you type so you can check for mistakes.",
      },
      {
        title: "Tap Connect",
        description:
          'Tap the "Connect" or "Join" button. If the password is correct, your phone will connect to the Wi-Fi. You will see a Wi-Fi symbol at the top of your screen.',
      },
    ],
    appleSteps: [
      {
        title: "Open Settings",
        description:
          "Find the grey Settings icon (it looks like gears) on your iPhone home screen. Tap it.",
      },
      {
        title: "Tap Wi-Fi",
        description:
          'Near the top of the Settings menu, tap "Wi-Fi".',
      },
      {
        title: "Make sure Wi-Fi is on",
        description:
          "Look at the switch next to Wi-Fi at the top. If it is green, Wi-Fi is already on. If it is grey, tap the switch to turn it on.",
      },
      {
        title: "Select your network",
        description:
          "A list of Wi-Fi networks will appear. Find your home Wi-Fi network name and tap it.",
        tip: "Your Wi-Fi name is usually printed on a label on your router or modem.",
      },
      {
        title: "Type your password",
        description:
          "A box will appear asking for your Wi-Fi password. Type it in carefully. Then tap \"Join\".",
        tip: "Tap the little eye icon to see what you are typing and make sure it is correct.",
      },
      {
        title: "Connected!",
        description:
          "A tick will appear next to your Wi-Fi name and the Wi-Fi symbol will appear at the top of your screen. You are now connected!",
      },
    ],
  },
];

export interface IssueItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  androidSolution: string;
  appleSolution: string;
}

export const commonIssues: IssueItem[] = [
  {
    id: "battery",
    icon: "battery",
    title: "Battery draining too fast",
    description: "Your phone runs out of charge faster than expected",
    androidSolution:
      "1. Go to Settings > Battery\n2. Turn on Battery Saver mode\n3. Reduce screen brightness\n4. Turn off Bluetooth if you are not using it\n5. Close apps you are not using by pressing the square button and swiping them away",
    appleSolution:
      "1. Go to Settings > Battery\n2. Turn on Low Power Mode\n3. Reduce screen brightness in Settings > Display & Brightness\n4. Turn off Wi-Fi and Bluetooth if not needed\n5. Close unused apps by swiping up from the bottom and flicking apps away",
  },
  {
    id: "slow",
    icon: "zap",
    title: "Phone running slowly",
    description: "Apps take a long time to open or the phone feels sluggish",
    androidSolution:
      "1. Restart your phone by holding the power button and tapping Restart\n2. Close all open apps by pressing the square button at the bottom\n3. Delete apps you no longer use\n4. Make sure your phone has enough storage in Settings > Storage",
    appleSolution:
      "1. Restart your iPhone: hold the side button + volume button, then slide to power off\n2. Wait 30 seconds, then turn it back on\n3. Close all apps by swiping up from the bottom\n4. Delete unused apps to free up space",
  },
  {
    id: "calls",
    icon: "phone-off",
    title: "Cannot make or receive calls",
    description: "Calls are not working or you can't hear the other person",
    androidSolution:
      "1. Check that you have mobile signal at the top of your screen\n2. Make sure Aeroplane Mode is turned OFF in Settings\n3. Try turning your phone off and on again\n4. Check your volume is turned up using the buttons on the side of your phone",
    appleSolution:
      "1. Check for mobile signal bars at the top left of your screen\n2. Make sure Do Not Disturb is turned off in Settings > Focus\n3. Check that Airplane Mode is off in Settings\n4. Restart your iPhone and try again",
  },
  {
    id: "storage",
    icon: "hard-drive",
    title: "Phone storage is full",
    description: "You keep getting messages that your phone is out of space",
    androidSolution:
      "1. Go to Settings > Storage to see what is using space\n2. Delete old photos and videos you no longer need\n3. Remove apps you do not use\n4. Transfer photos to your computer or a cloud service",
    appleSolution:
      "1. Go to Settings > General > iPhone Storage\n2. Review the recommendations Apple shows you\n3. Delete apps you do not need\n4. Enable iCloud Photos to store pictures in the cloud automatically",
  },
  {
    id: "frozen",
    icon: "alert-triangle",
    title: "App or screen is frozen",
    description: "An app stopped responding or the screen will not move",
    androidSolution:
      "1. Press the square button to go back to your recent apps\n2. Swipe the frozen app off the screen to close it\n3. If the whole phone is frozen, hold the power button for 10 seconds to force restart",
    appleSolution:
      "1. Swipe up from the very bottom to see your open apps\n2. Swipe the frozen app upward to close it\n3. If the whole phone is frozen: quickly press Volume Up, then Volume Down, then hold the Side button until the Apple logo appears",
  },
];
