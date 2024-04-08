"use client";

// Import necessary modules and components
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import React, {useEffect } from "react";
import LoadingDots from "./LoadingDots";
import languages from "../utils/languages";
import { Toaster, toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import SOUND_MODELS, { SoundModel } from "@/lib/constants";
import AudioTranslate from "./AudioTranslate";

// Define the validation schema for the form fields
const FormSchema = z.object({
  soundModel: z.string({
    required_error: "Please select a Hugging Face sound model to use.",
  }),
  text: z.string({
    required_error: "Please select a text for the model to use.",
  }),
});

// Define the props interface for the GenerateSoundForm component
interface GenerateSoundFormProps {
  handleGetAudio: (data: CreateSoundRequest) => void;
}

// Main component function
export function GenerateSoundForm({ handleGetAudio }: GenerateSoundFormProps) {
  // State for tracking form submission status
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Initialize the react-hook-form with the validation schema
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Function to handle form submission
  

  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string>(languages[0].value);
  const [generatedTranslation, setGeneratedTranslation] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormSubmitting(true);
    
    // Prepare the sound request object
    const soundRequest: CreateSoundRequest = {
      modelUrl: data.soundModel,
      text: generatedTranslation,
    };
    
    // Call the provided handler function with the sound request
    handleGetAudio(soundRequest);
    
    setFormSubmitting(false);
  }

  const url = "https://api.openai.com/v1/audio/transcriptions";

  const transcribe = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    if (language) {
      formData.append("language", language);
    }

    const headers = new Headers();
    headers.append(
      "Authorization",
      `Bearer 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`
    );

    return fetch(url, {
      method: "POST",
      body: formData,
      headers: headers,
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const translateAudio = async () => {
    setGeneratedTranslation("");
    setLoading(true);

    const transcribed = await transcribe();

    setGeneratedTranslation(transcribed.text);
    setLoading(false);
    setFormSubmitting(true);
    
    // Prepare the sound request object
    const soundRequest: CreateSoundRequest = {
      modelUrl: "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits",
      text: generatedTranslation,
    };
    
    // Call the provided handler function with the sound request
    handleGetAudio(soundRequest);
    
    setFormSubmitting(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedLabel = languages.find(
      (language) => language.value === selectedValue
    )?.value;
    if (selectedLabel) {
      setLanguage(selectedLabel);
    }
  };

  const fileUrl = "/audio.mp3";

  function handleDownload() {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div className="ml-8 mr-8">
      <div className="max-w-xl w-full">
        <div className="flex flex-row mt-10 items-center space-x-3">
          <Image
            src="/1-black.png"
            width={30}
            height={30}
            alt="1 icon"
            className="mb-5 sm:mb-0"
          />
          <div className="">
            <p className="text-left font-medium ">
              Upload Audio File{" "}
              
              <span className="text-slate-500 ">)</span>
            </p>
          </div>
        </div>

        <label className="block my-1 ml-1 text-sm text-left font-medium text-gray-900 dark:text-white">
          Upload file:
        </label>
        <input
          className="block mb-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <p className="my-2 text-sm text-gray-500 dark:text-gray-300">
          The following file formats are accepted: m4a, mp3, webm, mp4, mpga,
          wav, and mpeg.
        </p>

        <div className="flex mb-5 items-center space-x-3">
          <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
          <p className="text-left font-medium">Choose your Language.</p>
        </div>

        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
          onChange={handleChange}
          value={language}
        >
          {languages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>

        {!loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            onClick={translateAudio}
          >
            Translate &rarr;
          </button>
        )}
        {loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            disabled
          >
            <LoadingDots color="white" style="large" />
          </button>
        )}

        {generatedTranslation && (
          <>
            <label className="block my-2 text-md text-left font-medium text-gray-900 dark:text-white">
              Translation:
            </label>
            <div
              className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(generatedTranslation);
                toast("Translation copied to clipboard", {
                  icon: "✂️",
                });
              }}
            >
              <p> {generatedTranslation}</p>
            </div>
            <p className="my-1 text-sm text-gray-500 dark:text-gray-300">
              Click on translation to copy on clipboard
            </p>
            <div className="mb-[-80px]" />
          </>
        )}
        <br></br>
        <br></br>
        <br></br>
        <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            onClick={translateAudio}
          >
            Generate Audio
          </button>
      </div>
      {/* Form component that uses react-hook-form */}
      
    </div>
  );
}
