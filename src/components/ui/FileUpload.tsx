'use client'
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Inbox } from "lucide-react"


const FileUpload = () => {
    const {getInputProps, getRootProps} = useDropzone({
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
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