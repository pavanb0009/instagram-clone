"use client"


import React, { useState, useCallback } from 'react';
import { Upload, X, CropIcon, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Cropper from 'react-easy-crop';


export const getCroppedImg = (imageSrc, pixelCrop, rotation = 0) => {
    const image = new Image();
    image.src = imageSrc;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
  
    canvas.width = safeArea;
    canvas.height = safeArea;
  
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);
  
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );
  
    const data = ctx.getImageData(0, 0, safeArea, safeArea);
  
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file));
      }, 'image/jpeg');
    });
  };

const MAX_IMAGES = 5;

const CreatePosts = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      crop: { x: 0, y: 0 },
      zoom: 1,
      rotation: 0,
      croppedImage: null,
      filters: { brightness: 100, contrast: 100, saturation: 100 }
    }));
    setImages([...images, ...newImages]);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    const updatedImages = [...images];
    updatedImages[currentImageIndex].croppedAreaPixels = croppedAreaPixels;
    setImages(updatedImages);
  }, [images, currentImageIndex]);

  const handleCropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        images[currentImageIndex].preview,
        images[currentImageIndex].croppedAreaPixels,
        images[currentImageIndex].rotation
      );
      const updatedImages = [...images];
      updatedImages[currentImageIndex].croppedImage = croppedImage;
      setImages(updatedImages);
    } catch (e) {
      console.error(e);
    }
  }, [images, currentImageIndex]);

  const handleFilterChange = (filter, value) => {
    const updatedImages = [...images];
    updatedImages[currentImageIndex].filters[filter] = value;
    setImages(updatedImages);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (currentImageIndex >= updatedImages.length) {
      setCurrentImageIndex(updatedImages.length - 1);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const updateImageProperty = (property, value) => {
    const updatedImages = [...images];
    updatedImages[currentImageIndex][property] = value;
    setImages(updatedImages);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Upload images (max 5)</span>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="relative h-96">
          <Cropper
            image={images[currentImageIndex].preview}
            crop={images[currentImageIndex].crop}
            zoom={images[currentImageIndex].zoom}
            aspect={1}
            onCropChange={(crop) => updateImageProperty('crop', crop)}
            onCropComplete={onCropComplete}
            onZoomChange={(zoom) => updateImageProperty('zoom', zoom)}
            rotation={images[currentImageIndex].rotation}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
              },
              imageStyle: {
                filter: `brightness(${images[currentImageIndex].filters.brightness}%) 
                         contrast(${images[currentImageIndex].filters.contrast}%) 
                         saturate(${images[currentImageIndex].filters.saturation}%)`
              },
            }}
          />

          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemoveImage(currentImageIndex)}
          >
            <X className="w-4 h-4" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <div className="mb-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[images[currentImageIndex].zoom]}
              onValueChange={([value]) => updateImageProperty('zoom', value)}
            />
          </div>
          <div className="mb-2">
            <label className="text-sm font-medium">Rotation</label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[images[currentImageIndex].rotation]}
              onValueChange={([value]) => updateImageProperty('rotation', value)}
            />
          </div>
          <div className="mb-2">
            <label className="text-sm font-medium">Brightness</label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[images[currentImageIndex].filters.brightness]}
              onValueChange={([value]) => handleFilterChange('brightness', value)}
            />
          </div>
          <div className="mb-2">
            <label className="text-sm font-medium">Contrast</label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[images[currentImageIndex].filters.contrast]}
              onValueChange={([value]) => handleFilterChange('contrast', value)}
            />
          </div>
          <div className="mb-2">
            <label className="text-sm font-medium">Saturation</label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[images[currentImageIndex].filters.saturation]}
              onValueChange={([value]) => handleFilterChange('saturation', value)}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button variant="outline" className="mr-2" onClick={handleCropImage}>
          Apply Crop
        </Button>
        <Button variant="outline" className="mr-2">
          Cancel
        </Button>
        <Button>Post</Button>
      </div>
    </div>
  );
};

export default CreatePosts;