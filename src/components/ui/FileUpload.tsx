'use client'
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Inbox, Loader2 } from "lucide-react"
import { uploadToS3 } from "@/lib/s3"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import toast from "react-hot-toast"


const FileUpload = () => {
    const [uploading, setUploading] = useState(false)
    const { mutate, isLoading} = useMutation({
        mutationFn: async ({file_key, file_name}: {file_key: string, file_name: string}) => {
            const response = await axios.post('/api/create-chat', {file_key, file_name})
            return response.data
        }
    })
    const {getInputProps, getRootProps} = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            console.log(file, 'GETTING FILE')
            if (file.size > 10 * 1024 * 1024) {
                // bigger than 10mb!
               toast.error('File is too big! Must be less than 10mb')
                return;
        }
            try {
                setUploading(true)
                const data = await uploadToS3(file);
                if (!data?.file_key || !data?.file_name) {
                    toast.error('Error uploading file')
                    return
                }
                mutate(data, {
                    onSuccess: (data) => {
                        console.log(data, 'DATA')
                       toast.success(data.message)
                    },
                    onError: (error) => {
                       toast.error('Error creating chat')
                    }
                })
       
            } catch (error) {
                console.log(error, 'ERROR UPLOADING DOC')
            } finally {
                setUploading(false)
            }
            
        }
    })
  return (
    <div className="p-2 bg-slate-100 rounded-xl">
        <div {...getRootProps({
            className: 'border-dashed border-2 border-slate-200 rounded-xl cursor-pointer p-4 bg-gray-50 py-8 justify-center flex items-center flex-col'
        })}>
            <input {...getInputProps()}/>
            {
                uploading || isLoading ? (
                    <>
                        <Loader2 className="h-10 w-10 text-slate-500 animate-spin"/>
                        <p className="mt-2 text-sm text-slate-400">Uploading... Spilling Tea to GPT</p>
                    </>
                ) : (
                    <>
                        <Inbox className='w-10 h-10 text-blue-700'/>
                        <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </>
                )
            }
        </div>
    </div>
  )
}

export default FileUpload