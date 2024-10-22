 // Start of Selection
'use client';
import NextImage from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { storage } from '../../config/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import mainImg from '../../assets/Frame5.svg';
import Loader from 'react-dots-loader';
import 'react-dots-loader/index.css';
import { Button } from '../../components/ui/button';
import { addDownload } from '../../config/firestore';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import fortuneCookies from '../../../data/fortune-cookie.json';
import { Cookie } from 'lucide-react';
import FortuneCookieButton from '../../components/ui/fortune-cookie';
import ShareButton from '../../components/ui/share-button';
import ImagePanel from './components/ImagePanel';
import SelectPanel from './components/SelectPanel';

const skinTypes = ['skin1', 'skin2', 'skin3', 'skin4', 'skin5', 'skin6', 'skin7', 'skin8', 'skin9', 'skin10', 'universal'];

export default function Generator() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#aabbcc');
  const [tab, setTab] = useState<'background' | 'body' | 'skin' | 'eyes' | 'top' | 'mouth' | 'glasses' | 'earrings'>('background');
  const [skinType, setSkinType] = useState<string | null>(null);
  const [fortuneCookie, setFortuneCookie] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  const clearState = () => {
    setFortuneCookie(null);
    setShareUrl('');
  };

  const imageCategories = {
    background: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    body: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    skin: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    eyes: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    top: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    mouth: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    glasses: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
    earrings: { state: useState<string[]>(['']), initial: useState<string[]>(['']) },
  };

  const [
    [backgroundImages, setBackgroundImages],
    [bodyImages, setBodyImages],
    [skinImages, setSkinImages],
    [eyesImages, setEyesImages],
    [topImages, setTopImages],
    [mouthImages, setMouthImages],
    [glassesImages, setGlassesImages],
    [earringsImages, setEarringsImages],
  ] = [
    imageCategories.background.state,
    imageCategories.body.state,
    imageCategories.skin.state,
    imageCategories.eyes.state,
    imageCategories.top.state,
    imageCategories.mouth.state,
    imageCategories.glasses.state,
    imageCategories.earrings.state,
  ];

  const [[initialBackground], [initialBody], [initialSkin], [initialEyes], [initialTop], [initialMouth], [initialGlasses], [initialEarrings]] = [
    imageCategories.background.initial,
    imageCategories.body.initial,
    imageCategories.skin.initial,
    imageCategories.eyes.initial,
    imageCategories.top.initial,
    imageCategories.mouth.initial,
    imageCategories.glasses.initial,
    imageCategories.earrings.initial,
  ];

  const [selected, setSelected] = useState({
    background: '',
    body: '',
    skin: '',
    eyes: '',
    top: '',
    mouth: '',
    glasses: '',
    earrings: '',
  });

  const [imagesLoaded, setImagesLoaded] = useState({
    background: false,
    body: false,
    skin: false,
    eyes: false,
    top: false,
    mouth: false,
    glasses: false,
    earrings: false,
  });

  const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const extractFolderAndFileName = (url: string): { folder: string; file: string } => {
    const [, path] = decodeURIComponent(url).split('/o/');
    const [pathWithoutQuery] = path.split('?');
    const parts = pathWithoutQuery.split('%2F');
    const folder = parts.slice(0, -1).join('/');
    const file = parts[parts.length - 1];

    return { folder, file };
  };

  const filterImagesByVar = (images: string[], varIdentifier: string): string[] =>
    images.filter((img) => new RegExp(`(${varIdentifier})(?!\\d)`).test(img) || img.includes('universal'));

  const setBodyType = (url: string): string | null => {
    const varIdentifier = url.match(/(skin\d{1,2}|universal)/)?.[1];

    if (!varIdentifier) return null;
    const matchedImages = filterImagesByVar(initialBody, varIdentifier);
    setBodyImages(matchedImages);
    if (varIdentifier !== 'universal') {
      setSkinType(varIdentifier);
      return varIdentifier;
    } else {
      setSkinType(null);
      return null;
    }
  };

  const setSkinTypeFromSkin = (url: string): string | null => {
    const varIdentifier = url.match(/(skin\d{1,2})/)?.[1];

    if (!varIdentifier) return null;

    setSkinType(varIdentifier);
    const matchedBodyImages = filterImagesByVar(initialBody, varIdentifier);
    setBodyImages(matchedBodyImages);

    if (varIdentifier && selected.body) {
      let tmp = selected.body;
      const { folder, file } = extractFolderAndFileName(tmp);

      const newBodyUrl = matchedBodyImages.find((img) => img.includes(file.replaceAll('/', '%2F').replace(/skin\d{1,2}/, varIdentifier)))!;

      if (matchedBodyImages.includes(newBodyUrl)) {
        setSelected((prev) => ({ ...prev, body: newBodyUrl }));
      } else {
        const randomMatchedBody = getRandomElement(matchedBodyImages);
        setSelected((prev) => ({ ...prev, body: randomMatchedBody }));
      }
    }

    return varIdentifier;
  };

  const getRandomImages = useCallback(() => {
    clearState();

    if (Object.values(imageCategories).some((category) => category.initial[0].length === 0)) return;

    const newSelected = { ...selected };

    for (const [category, { initial }] of Object.entries(imageCategories)) {
      const randomImage = getRandomElement(initial[0]);
      newSelected[category as keyof typeof selected] = randomImage;
    }

    // Body and Skin type matching
    const randomSkinType = getRandomElement(skinTypes);
    const randomBody = getRandomElement(filterImagesByVar(initialBody, randomSkinType));
    newSelected.body = randomBody;
    const skinType = setBodyType(randomBody);

    let matchingSkins: any;
    if (skinType !== null) matchingSkins = skinImages.filter((url) => new RegExp(`(${skinType})(?!\\d)`).test(url));
    else matchingSkins = skinImages;
    newSelected.skin = getRandomElement(matchingSkins);

    setSelected(newSelected);

    return newSelected;
  }, [initialBackground, initialBody, imageCategories, selected, setBodyType, skinImages, skinType]);

  const fetchImages = useCallback(
    async (category: keyof typeof imageCategories, folder: string) => {
      const listRef = ref(storage, folder);
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(getDownloadURL));
      imageCategories[category].state[1](urls);
      imageCategories[category].initial[1](urls);
      setImagesLoaded((prev) => ({ ...prev, [category]: true }));
      console.log(`${category}`, urls);
    },
    [imageCategories]
  );

  const fetchSingleImage = async (folder: string, imageName: string) => {
    const listRef = ref(storage, `${folder}/${imageName}`);
    const url = await getDownloadURL(listRef);
    return url;
  };

  useEffect(() => {
    fetchImages('background', 'LD_ASSETS/background/');
    fetchImages('body', 'LD_ASSETS/body/');
    fetchImages('skin', 'LD_ASSETS/skin/');
    fetchImages('eyes', 'LD_ASSETS/eyes/');
    fetchImages('top', 'LD_ASSETS/top/');
    fetchImages('mouth', 'LD_ASSETS/mouth/');
    fetchImages('glasses', 'LD_ASSETS/glasses/');
    fetchImages('earrings', 'LD_ASSETS/earrings/');
  }, []);

  // Define default trait filenames
  const DEFAULT_TRAITS = {
    background: 'iceblue.png',
    body: 'tshirtwhite_skin1.png',
    skin: 'skin1_rosy.png',
    eyes: 'blue.png',
    top: 'originalbrown.png',
    mouth: 'trollgrin.png',
    glasses: 'cfbglasses.png',
    earrings: 'noearrings.png',
  };

  // Function to set selected traits to default
  const setDefaultSelected = useCallback(() => {
    const newSelected: typeof selected = { ...selected };
    for (const [category, filename] of Object.entries(DEFAULT_TRAITS)) {
      const imagesArray = imageCategories[category as keyof typeof imageCategories].state[0];
      const matchedImage = imagesArray.find((url) => url.includes(filename));
      if (matchedImage) {
        newSelected[category as keyof typeof selected] = matchedImage;
      } else {
        newSelected[category as keyof typeof selected] = '';
      }
    }
    setSelected(newSelected);
    setColor('#aabbcc');
    setSkinType(null);
  }, [imageCategories]);

  // Set default selected traits once all images are loaded
  useEffect(() => {
    const allLoaded = Object.values(imagesLoaded).every((loaded) => loaded);
    if (allLoaded) {
      setDefaultSelected();
    }
  }, [imagesLoaded]);

  const resetSelections = () => {
    setDefaultSelected();
    clearState();
  };

  const combineImages = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    const width = 2400;
    const height = 2400;
    canvas.width = width;
    canvas.height = height;

    if (!selected.background) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    }

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });

    try {
      const loadSelectedImage = async (key: keyof typeof selected) => {
        if (selected[key]) {
          const { folder, file } = extractFolderAndFileName(selected[key]);
          const hdFolder = folder.replace('LD_ASSETS', 'HD_ASSETS');
          return loadImage(await fetchSingleImage(hdFolder, file));
        }
        return null;
      };

      const images = await Promise.all(['background', 'body', 'skin', 'eyes', 'top', 'mouth', 'glasses', 'earrings'].map((key) => loadSelectedImage(key as keyof typeof selected)));

      images.forEach((img) => {
        if (img) {
          ctx.drawImage(img, 0, 0, width, height);
        }
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error combining images:', error);
      return '';
    }
  };

  const uploadImage = async (dataUrl: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append('image', dataUrl.split(',')[1]); // Remove the data URL prefix

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return result.data.url;
    } else {
      throw new Error('Image upload failed');
    }
  };

  const downloadImage = async () => {
    const dataUrl = await combineImages();

    setFortuneCookie(getRandomElement(fortuneCookies));

    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'combined-pfp.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      try {
        const uploadedImageUrl = await uploadImage(dataUrl);
        console.log('uploadedImageUrl', uploadedImageUrl);
        setShareUrl(uploadedImageUrl);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Image upload failed. Please try again.');
      }

      addDownload({
        selected,
        createdAt: serverTimestamp(),
      });
    } else {
      alert('Failed to generate image.');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full flex flex-col">
        <div className="sm:flex w-full border-t-2 border-b-2 border-black">
          <div className="w-full sm:w-1/2 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
            <NextImage alt="Main Image" src={mainImg} className="w-full" />
          </div>
          <div className="flex flex-col justify-between px-7 py-5 md:px-12 md:py-8 w-full sm:w-1/2">
            <div>
              <h1 className="bricolageSemibold text-3xl md:text-5xl lg:text-7xl">CREATE & DOWNLOAD YOUR FAVOURITE CFB PFP!</h1>
              <p className="mt-3 text-base md:text-xl lg:text-2xl workSans">Pick and choose between various elements to compose your CFB PFP</p>
            </div>
            <div className="bricolageSemibold text-xl md:text-2xl lg:text-4xl">
              Read <span className="text-[#FF6B00] underline cursor-pointer">instructions</span> for more info
            </div>
          </div>
        </div>

        <div className="lg:flex p-6 lg:p-12 justify-between gap-4">
          <SelectPanel
            tab={tab}
            setTab={setTab}
            selected={selected}
            setSelected={setSelected}
            imageCategories={imageCategories}
            imagesLoaded={imagesLoaded}
            resetSelections={resetSelections}
            getRandomImages={getRandomImages}
            downloadImage={downloadImage}
            setBodyType={setBodyType}
            setSkinTypeFromSkin={setSkinTypeFromSkin}
            color={color}
            setColor={setColor}
          />

          <div className="flex md:flex-col text-center">
            <ImagePanel selected={selected} color={color} shareUrl={shareUrl} captureRef={captureRef} />

            <div className="flex flex-1 flex-col justify-center">
              {fortuneCookie && (
                <FortuneCookieButton
                  fortuneCookieText={fortuneCookie}
                  isVisible={true}
                  onClick={() => {}}
                  fortuneCookieTextClassName="bricolageSemibold text-3xl mt-10"
                  width={200}
                  height={150}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
