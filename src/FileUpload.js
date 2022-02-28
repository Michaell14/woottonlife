import React, {useEffect, useState} from 'react';
import { Box, Flex, Text, Input, Image, SliderFilledTrack} from '@chakra-ui/react';
import {useDropzone} from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


function FileUpload(props) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDropAccepted: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <>
    <Box>
      <Flex {...getRootProps({className: 'dropzone'})}>
        <Input {...getInputProps()} />
        <Text borderRadius={5} border={"dotted 2px"} borderColor={"#71809642"}>Drag 'n' drop an icon here. For some reason it doesn't show 
          the preview when you select from the file box
        </Text>
      </Flex>
      <Flex>
        {thumbs}
      </Flex>
    </Box>
    </>
  );
}

export default FileUpload;
