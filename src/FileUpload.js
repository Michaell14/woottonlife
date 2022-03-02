import React, {useEffect, useState} from 'react';
import { Box, Flex, Text, Input, Image, SliderFilledTrack} from '@chakra-ui/react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

const FileUpload = ( {setFile} ) => {
  const toast = (innerHTML) => {
    const el = document.getElementById('toast')
    el.innerHTML = innerHTML
    el.className = 'show'
    setTimeout(() => { el.className = el.className.replace('show', '') }, 3000)
  }

  const getUploadParams = ({setFile}) => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === 'headers_received') {
      toast(`${meta.name} uploaded!`)
      console.log(file);
      setFile(file);
    } else if (status === 'aborted') {
      alert("There was an error with the file");
    }
  }

  return (
    <>
      <div id="toast">Upload</div>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        inputContent="Drag Files or Click to Browse"
        styles={{
          dropzone: { width: 420, height: 140 },
        }}
        accept="image/*"
      />
    </>
  )
}


export default FileUpload;