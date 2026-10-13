import React, { useState } from 'react';
import { Smartphone, Copy, Check, Terminal, ExternalLink, X, Code2, Download, QrCode } from 'lucide-react';

interface ReactNativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReactNativeModal: React.FC<ReactNativeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'app' | 'package' | 'appjson'>('guide');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const reactNativeAppCode = `// App.tsx - Pure React Native & Expo Implementation
// Android-friendly 3D Logo Studio with Three.js / Expo-GL, Image Import & PNG Export

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 40;

export default function App() {
  // --- Logo State ---
  const [primaryText, setPrimaryText] = useState('NEXUS');
  const [fontFamily, setFontFamily] = useState('System');
  const [fontSize, setFontSize] = useState(48);
  const [extrusionDepth, setExtrusionDepth] = useState(25);
  const [textColor, setTextColor] = useState('#FFD700');
  const [extrusionColor, setExtrusionColor] = useState('#B8860B');
  const [glowColor, setGlowColor] = useState('#FFB800');
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [rotX, setRotX] = useState(12);
  const [rotY, setRotY] = useState(-18);
  const [activeTab, setActiveTab] = useState<'text' | '3d' | 'image' | 'colors'>('text');
  
  // Custom Imported Image Emblem
  const [importedImage, setImportedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(90);

  // ViewShot Ref for PNG Export
  const canvasContainerRef = useRef<View>(null);

  // --- Pick Image from Android Gallery ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery permission is needed to import logo images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImportedImage(result.assets[0].uri);
    }
  };

  // --- Export PNG to Android Device & Share ---
  const exportLogoPNG = async () => {
    try {
      if (!canvasContainerRef.current) return;
      const uri = await captureRef(canvasContainerRef, {
        format: 'png',
        quality: 1.0,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Export 3D Logo to Android Gallery',
        });
      } else {
        Alert.alert('Exported', 'Saved to: ' + uri);
      }
    } catch (error) {
      Alert.alert('Export Error', 'Failed to generate PNG image.');
    }
  };

  // --- 3D Scene Initialization via Expo-GL ---
  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a0a0f, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffdf80, 1.4);
    directionalLight.position.set(3, 5, 4);
    scene.add(directionalLight);

    // 3D Emblem Geometry
    const geometry = new THREE.CylinderGeometry(1.4, 1.4, 0.3, 32);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(textColor),
      metalness: 0.85,
      roughness: 0.25,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);

    // Render loop
    const render = () => {
      requestAnimationFrame(render);
      mesh.rotation.x = (rotX * Math.PI) / 180 + Math.PI / 2;
      mesh.rotation.z = (rotY * Math.PI) / 180;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>3D Logo Forge</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportLogoPNG}>
          <Text style={styles.exportButtonText}>Export PNG</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Canvas Preview Card */}
      <View style={styles.previewWrapper}>
        <View
          ref={canvasContainerRef}
          collapsable={false}
          style={[styles.canvasCard, { backgroundColor: '#090514' }]}
        >
          {/* Custom Imported Emblem */}
          {importedImage && (
            <Image
              source={{ uri: importedImage }}
              style={[
                styles.importedImage,
                {
                  width: imageSize,
                  height: imageSize,
                  transform: [{ rotateX: \`\${rotX}deg\` }, { rotateY: \`\${rotY}deg\` }],
                },
              ]}
              resizeMode="contain"
            />
          )}

          {/* 3D Layer Extrusion Stack */}
          <View
            style={[
              styles.textContainer,
              {
                transform: [{ rotateX: \`\${rotX}deg\` }, { rotateY: \`\${rotY}deg\` }],
              },
            ]}
          >
            {/* Extruded 3D Depth Slices */}
            {Array.from({ length: Math.round(extrusionDepth / 4) }).map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.depthLayer,
                  {
                    color: extrusionColor,
                    fontSize,
                    top: i * 1.5,
                    left: i * -1.2,
                  },
                ]}
              >
                {primaryText}
              </Text>
            ))}

            {/* Front Beveled Face */}
            <Text
              style={[
                styles.frontFace,
                {
                  color: textColor,
                  fontSize,
                  textShadowColor: glowEnabled ? glowColor : 'transparent',
                  textShadowRadius: glowEnabled ? 16 : 0,
                },
              ]}
            >
              {primaryText}
            </Text>
          </View>

          {/* 3D Angle Indicator */}
          <View style={styles.angleBadge}>
            <Text style={styles.angleText}>
              X: {Math.round(rotX)}° | Y: {Math.round(rotY)}°
            </Text>
          </View>
        </View>
      </View>

      {/* Editor Category Tabs */}
      <View style={styles.tabBar}>
        {(['text', '3d', 'image', 'colors'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Control Panels */}
      <ScrollView style={styles.controlsScroll} contentContainerStyle={styles.controlsContent}>
        {activeTab === 'text' && (
          <View style={styles.panel}>
            <Text style={styles.label}>LOGO TEXT</Text>
            <TextInput
              style={styles.input}
              value={primaryText}
              onChangeText={setPrimaryText}
              placeholder="ENTER BRAND NAME"
              placeholderTextColor="#666"
              autoCapitalize="characters"
            />

            <Text style={styles.label}>FONT SIZE ({fontSize}px)</Text>
            <Slider
              minimumValue={24}
              maximumValue={72}
              value={fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#333"
              thumbTintColor="#FFD700"
            />
          </View>
        )}

        {activeTab === '3d' && (
          <View style={styles.panel}>
            <Text style={styles.label}>3D EXTRUSION DEPTH ({extrusionDepth}px)</Text>
            <Slider
              minimumValue={0}
              maximumValue={50}
              value={extrusionDepth}
              onValueChange={setExtrusionDepth}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#333"
              thumbTintColor="#FFD700"
            />

            <Text style={styles.label}>PITCH ROTATION X ({Math.round(rotX)}°)</Text>
            <Slider
              minimumValue={-40}
              maximumValue={40}
              value={rotX}
              onValueChange={setRotX}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#333"
              thumbTintColor="#FFD700"
            />

            <Text style={styles.label}>YAW ROTATION Y ({Math.round(rotY)}°)</Text>
            <Slider
              minimumValue={-50}
              maximumValue={50}
              value={rotY}
              onValueChange={setRotY}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#333"
              thumbTintColor="#FFD700"
            />
          </View>
        )}

        {activeTab === 'image' && (
          <View style={styles.panel}>
            <Text style={styles.label}>CUSTOM EMBLEM / ICON</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {importedImage ? 'Replace Gallery Image' : 'Import Image from Android'}
              </Text>
            </TouchableOpacity>

            {importedImage && (
              <>
                <Text style={styles.label}>EMBLEM SIZE ({imageSize}px)</Text>
                <Slider
                  minimumValue={40}
                  maximumValue={160}
                  value={imageSize}
                  onValueChange={setImageSize}
                  minimumTrackTintColor="#FFD700"
                  maximumTrackTintColor="#333"
                  thumbTintColor="#FFD700"
                />
              </>
            )}
          </View>
        )}

        {activeTab === 'colors' && (
          <View style={styles.panel}>
            <Text style={styles.label}>QUICK COLOR SCHEMES</Text>
            <View style={styles.colorRow}>
              {[
                { name: 'Gold', text: '#FFD700', depth: '#8A6208' },
                { name: 'Neon', text: '#00F0FF', depth: '#3B0764' },
                { name: 'Ruby', text: '#FB7185', depth: '#881337' },
                { name: 'Chrome', text: '#FFFFFF', depth: '#334155' },
              ].map((c) => (
                <TouchableOpacity
                  key={c.name}
                  style={[styles.colorChip, { backgroundColor: c.text }]}
                  onPress={() => {
                    setTextColor(c.text);
                    setExtrusionColor(c.depth);
                    setGlowColor(c.text);
                  }}
                >
                  <Text style={styles.colorChipText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  exportButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#090D16',
    fontWeight: '700',
    fontSize: 12,
  },
  previewWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  canvasCard: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE * 0.75,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  depthLayer: {
    position: 'absolute',
    fontWeight: '900',
    letterSpacing: 4,
  },
  frontFace: {
    fontWeight: '900',
    letterSpacing: 4,
  },
  importedImage: {
    marginBottom: 8,
  },
  angleBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  angleText: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#FFD70020',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#FFD700',
  },
  controlsScroll: {
    flex: 1,
  },
  controlsContent: {
    padding: 16,
  },
  panel: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  uploadButton: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  uploadButtonText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 13,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  colorChip: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  colorChipText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 11,
  },
});
`;

  const packageJsonCode = `{
  "name": "logoforge-3d-android",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "expo-gl": "~15.0.0",
    "expo-three": "^7.0.0",
    "three": "^0.170.0",
    "expo-image-picker": "~16.0.3",
    "expo-sharing": "~13.0.1",
    "react-native-view-shot": "3.8.0",
    "@react-native-community/slider": "4.5.5"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.3.12",
    "@types/three": "^0.170.0",
    "typescript": "^5.3.3"
  },
  "private": true
}`;

  const appJsonCode = `{
  "expo": {
    "name": "3D Logo Forge",
    "slug": "logoforge-3d",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#090D16"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#090D16"
      },
      "package": "com.logoforge.app",
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "MEDIA_LIBRARY"
      ]
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                React Native Android App & Testing Guide
              </h3>
              <p className="text-xs text-slate-400">
                Run on your Android phone in under 60 seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Android Testing Guide
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'app'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            App.tsx (Source)
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'package'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            package.json
          </button>
          <button
            onClick={() => setActiveTab('appjson')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'appjson'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            app.json
          </button>
        </div>

        {/* Tab 1: Android Testing Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            {/* Method 1: Instant Expo Go (QR Code) */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <QrCode className="w-4 h-4" />
                <span>Method 1: Test with Expo Go on Android Phone (Recommended)</span>
              </div>
              <p className="text-slate-400">
                You don't need Android Studio or heavy SDKs. You can test in 60 seconds directly on physical hardware:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                <li>
                  On your Android phone, install <strong className="text-white">"Expo Go"</strong> from Google Play Store.
                </li>
                <li>
                  On your computer, open terminal and run:
                  <div className="mt-1 p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 flex items-center justify-between">
                    <span>npx create-expo-app LogoForge3D --template blank-typescript</span>
                    <button
                      onClick={() =>
                        copyToClipboard('npx create-expo-app LogoForge3D --template blank-typescript', 'cmd1')
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
                <li>
                  Install dependencies:
                  <div className="mt-1 p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 flex items-center justify-between">
                    <span>npx expo install expo-gl expo-three three expo-image-picker react-native-view-shot expo-sharing @react-native-community/slider</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'npx expo install expo-gl expo-three three expo-image-picker react-native-view-shot expo-sharing @react-native-community/slider',
                          'cmd2'
                        )
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
                <li>
                  Replace <code className="text-amber-300">App.tsx</code> with the code in the <span className="text-white font-medium">App.tsx</span> tab above.
                </li>
                <li>
                  Run <code className="text-amber-300">npx expo start --tunnel</code> in your terminal.
                </li>
                <li>
                  Open <strong className="text-white">Expo Go</strong> on your Android phone and scan the QR code displayed in your terminal. The 3D Logo Design app will open immediately on your phone with native touch gestures and camera roll access!
                </li>
              </ol>
            </div>

            {/* Method 2: Test Right Now in Mobile Chrome */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Method 2: Test on Android Phone Right Now (PWA Web)</span>
              </div>
              <p className="text-slate-400">
                You can test this exact active studio on your Android phone right this second:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                <li>
                  Open this app URL in <strong className="text-white">Google Chrome on your Android phone</strong>.
                </li>
                <li>
                  Tap the three-dots menu (⋮) in Chrome and tap <strong className="text-white">"Add to Home screen"</strong> or <strong className="text-white">"Install app"</strong>.
                </li>
                <li>
                  It launches full-screen with native touch drag, gallery image import, and direct PNG gallery downloads!
                </li>
              </ul>
            </div>

            {/* Method 3: Build Standalone APK */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>Method 3: Build Standalone Android APK (.apk)</span>
              </div>
              <p className="text-slate-400">
                To build an installable APK file for Android:
              </p>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 flex items-center justify-between">
                <span>npm install -g eas-cli && eas build -p android --profile preview</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'npm install -g eas-cli && eas build -p android --profile preview',
                      'cmd3'
                    )
                  }
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'cmd3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Expo Application Services (EAS) will compile the APK in the cloud and give you a direct download link to install on any Android phone.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: App.tsx */}
        {activeTab === 'app' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">App.tsx</span>
              <button
                onClick={() => copyToClipboard(reactNativeAppCode, 'appCode')}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30"
              >
                {copiedKey === 'appCode' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy App.tsx</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 custom-scrollbar">
              {reactNativeAppCode}
            </pre>
          </div>
        )}

        {/* Tab 3: package.json */}
        {activeTab === 'package' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">package.json</span>
              <button
                onClick={() => copyToClipboard(packageJsonCode, 'pkgCode')}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30"
              >
                {copiedKey === 'pkgCode' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy package.json</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 custom-scrollbar">
              {packageJsonCode}
            </pre>
          </div>
        )}

        {/* Tab 4: app.json */}
        {activeTab === 'appjson' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">app.json</span>
              <button
                onClick={() => copyToClipboard(appJsonCode, 'appJsonCode')}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30"
              >
                {copiedKey === 'appJsonCode' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy app.json</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 custom-scrollbar">
              {appJsonCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
