import React from 'react';
import {
  FolderTree,
  FileCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, ProjectFile } from '../data/androidProjectFiles';

export const AndroidProjectExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<ProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = React.useState(false);
  const [isZipping, setIsZipping] = React.useState(false);
  const [zipSuccess, setZipSuccess] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into zip structure
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Also add root gradle files
      zip.file(
        'android/settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "MakeDarkLauncher"
include(":app")`
      );

      zip.file(
        'android/build.gradle.kts',
        `plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}`
      );

      zip.file(
        'android/gradle.properties',
        `org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=false
android.nonTransitiveRClass=true
kotlin.code.style=official`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'make-dark-amoled-launcher-android-studio.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate project zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-[#0d0d0d] rounded-2xl border border-[#222222] overflow-hidden text-white">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-[#121212] border-b border-[#222222] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2a2a2a] flex items-center justify-center text-[#448AFF]">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Android Studio Project Inspector</h2>
            <p className="text-xs text-zinc-400">
              Complete source code compiled for itel Vision 1 LTE (Android 9 Pie / API 28+)
            </p>
          </div>
        </div>

        {/* Action button: Download ZIP */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-4 py-2 rounded-xl bg-[#448AFF] hover:bg-[#2979FF] text-black text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md self-start sm:self-auto"
        >
          {isZipping ? (
            <span>Generating ZIP...</span>
          ) : zipSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Project Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Android Studio Project (.zip)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Split Body: File Tree (left) + Code Viewer (right) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="w-full md:w-72 bg-[#121212] border-r border-[#222222] p-3 flex flex-col overflow-y-auto no-scrollbar shrink-0">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-2">
            Project Files
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border border-[#448AFF]/50 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161616]'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#448AFF]' : 'text-zinc-500'
                    }`}
                  />
                  <div className="truncate">
                    <div className="truncate text-zinc-200">{file.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick itel Vision 1 Optimization Tag */}
          <div className="mt-auto pt-4 border-t border-[#222222] text-[11px] text-zinc-400 p-2">
            <div className="flex items-center gap-1.5 text-white font-medium mb-1">
              <Cpu className="w-3.5 h-3.5 text-[#448AFF]" />
              <span>Low RAM Compliant</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Uses lazy composables and lightweight SharedPreferences to preserve memory on 2GB RAM.
            </p>
          </div>
        </div>

        {/* Right Main Panel: Code Viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] overflow-hidden">
          {/* File Header Details */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-[#141414] border-b border-[#222222]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs font-semibold text-white truncate">
                {selectedFile.path}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono uppercase bg-[#1f1f1f] px-1.5 py-0.5 rounded">
                {selectedFile.language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#202020] hover:bg-[#282828] text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code description banner */}
          <div className="px-5 py-2 bg-[#121212]/70 border-b border-[#1f1f1f] text-xs text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#448AFF]" />
            <span>{selectedFile.description}</span>
          </div>

          {/* Syntax display */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-300 bg-[#070707] no-scrollbar">
            <pre className="leading-relaxed">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
