'use client'
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Inbox } from "lucide-react"
import { uploadToS3 } from "@/lib/s3"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'

const FileUpload = () => {
    const { mutate} = useMutation({
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
                console.log('FILE TOO BIG')
                return;
        }
            try {
                const data = await uploadToS3(file);
                console.log(data, 'DATA!!!!!')
       
            } catch (error) {
                console.log(error, 'ERROR UPLOADING DOC')
            }
            
        }
    })
  return (
    <div className="p-2 bg-slate-100 rounded-xl">
        <div {...getRootProps({
            className: 'border-dashed border-2 border-slate-200 rounded-xl cursor-pointer p-4 bg-gray-50 py-8 justify-center flex items-center flex-col'
        })}>
            <input {...getInputProps()}/>
            <>
                <Inbox className='w-10 h-10 text-blue-700'/>
                <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
            </>
        </div>
    </div>
  )
}

export default FileUpload