# Purbasha's 20th Birthday Surprise Website 🎂✨
A magical, interactive birthday surprise web application made with love for Purbasha from Soumik.

---

## 🚀 Unzip করে সরাসরি GitHub-এ Upload ও Live করার নিয়ম (Step-by-Step)

এই প্রোজেক্টের সব ফাইল ও ফোল্ডার **GitHub Actions + GitHub Pages**-এর জন্য ১০০% প্রস্তুত করা আছে। আপনার কম্পিউটারে আলাদা কোনো সফটওয়্যার বা টার্মিনাল ছাড়াও শুধু ফোল্ডার আপলোড করলেই ওয়েবসাইটটি অটো-বিল্ড হয়ে লাইভ হয়ে যাবে!

### ধাপ ১: GitHub-এ নতুন Repository তৈরি করুন
1. আপনার GitHub অ্যাকাউন্টে লগইন করে **New Repository** তৈরি করুন (যেমন: `purbasha-birthday`)।
2. Repository-টি **Public** রাখুন (GitHub Pages ফ্রি-তে চালানোর জন্য)।

### ধাপ ২: Unzip করা সব ফাইল ও ফোল্ডার Upload করুন
ডাউনলোড করা ZIP ফাইলটি **Unzip** করার পর ভেতরের সব ফাইল এবং ফোল্ডার (বিশেষ করে visible **`docs`** ফোল্ডার সহ) আপনার GitHub রিপোজিটরিতে আপলোড করুন।

- **যদি GitHub Desktop / Git CLI ব্যবহার করেন:** লুকানো `.github` ফোল্ডারটিও অটোমেটিক আপলোড হয়ে যাবে।
- **যদি ব্রাউজার থেকে Drag & Drop ("Upload files") করেন:** `.github` ফোল্ডারটি Windows/Mac-এ hidden থাকলেও **`docs`** ফোল্ডারটি সম্পূর্ণ visible থাকবে এবং সরাসরি কাজ করবে!

### ধাপ ৩: GitHub Pages চালু করুন (যেকোনো ১টি অপশন বেছে নিন)
1. আপনার GitHub Repository-এর **Settings → Pages**-এ যান।
2. **অপশন ক (যদি `.github` আপলোড হয়ে থাকে):**
   - **Source** থেকে **GitHub Actions** সিলেক্ট করুন। ১–২ মিনিটে অটো-বিল্ড হয়ে সাইট লাইভ হবে।
3. **অপশন খ (সবচেয়ে সহজ — কোনো hidden ফোল্ডার না থাকলেও চলবে):**
   - **Source** থেকে **Deploy from a branch** সিলেক্ট করুন।
   - Branch হিসেবে **`main`** এবং ফোল্ডার হিসেবে **`/docs`** (অথবা `/ (root)`) সিলেক্ট করে **Save** করুন।
4. আপনার লাইভ লিংক হবে:
   `https://<আপনার-ইউজারনেম>.github.io/<রিপো-নাম>/`

---

## 🔒 কোড ও ফটো সুরক্ষা (Anti-Theft Protection)
- **Right-Click Blocked:** ওয়েবসাইটে কেউ রাইট-ক্লিক করতে পারবে না।
- **Inspect Element & Shortcuts Blocked:** F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S সম্পূর্ণ নিষ্ক্রিয় করা হয়েছে।
- **Image Dragging Blocked:** ছবি টেনে কপি করা যাবে না।
- **No Sourcemaps:** প্রোডাকশন বিল্ডে কোনো সোর্স কোড ম্যাপ এক্সপোজ হবে না।

---

## 📸 ছবি ও বাংলা লেখা পরিবর্তন করার নিয়ম
১. ওয়েবসাইটে কার্ড সেকশনে সরাসরি **"ছবি ও বার্তা পরিবর্তন করুন"** অপশন ব্যবহার করা যাবে, অথবা
২. `src/data/memoriesData.ts` ফাইলে ছবি ও বাংলা বার্তা এডিট করে নিতে পারেন।
৩. পিন পরিবর্তন করতে চাইলে `src/components/StarryLockScreen.tsx`-এ `1407` পরিবর্তন করতে পারেন।

---

Made for Purbasha's 20th Milestone Birthday · 20/11/2006

