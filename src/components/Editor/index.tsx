import dynamic from 'next/dynamic';

import { css } from '@emotion/react';
import { useCallback, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import { Icon, IconButton } from '~/components/Common';
import { classnames as cn } from '~/components/Editor/classnames';
import ThumbnailBar from '~/components/Editor/ThumbnailBar';
import { fontCss, palettes } from '~/styles/utils';

import { imageHandler } from './imageHandler';

const ReactQuill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중</p>,
});

interface EditorProps {}

const Editor = (props: EditorProps) => {
  const [value, setValue] = useState('');
  const [images, setImages] = useState<Blob[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const hasThumbnails = !!thumbnails.length;

  const handleImageUpload = useCallback(() => {
    imageHandler({
      onUploadStart: () => {
        /* loading true */
      },
      onUploadSettled: () => {
        /* loading false */
      },
      onUploadError: (err) => console.log(err),
      onUploadSuccess: ({ blob, src }) => {
        // NOTE: s3에 즉시 업로드하는 방식이 될 듯
        setImages((prevBlobs) => [...prevBlobs, blob]);
        setThumbnails((prevThumbnails) => [...prevThumbnails, src]);
      },
    });
  }, []);

  return (
    <div css={selfCss}>
      <ReactQuill
        modules={modules}
        value={value}
        onChange={setValue}
        placeholder={'placeholder'}
        formats={formats}
      />

      {hasThumbnails && (
        <div css={thumbnailBarCss}>
          <ThumbnailBar thumbnails={thumbnails} />
        </div>
      )}

      <div css={bottomToolbarCss}>
        <IconButton
          type="button"
          size={28}
          theme="black"
          onClick={handleImageUpload}
        >
          <Icon name="image" label="사진 첨부" size={18} />
        </IconButton>
      </div>
    </div>
  );
};

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'underline'],
      ['code', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  },
};

const formats = [
  'header',
  'bold',
  'underline',
  'ordered',
  'bullet',
  'link',
  'code',
  'code-block',
];

export default Editor;

const editorBorder = `1px ${palettes.grey3} solid`;

const selfCss = css({
  backgroundColor: palettes.white,
  color: 'black',
  [`& .${cn.toolbar}`]: {
    border: editorBorder,
  },
  [`& .${cn.editorContainer}`]: {
    border: editorBorder,
    borderBottom: 0,
  },
  [`& .${cn.editor}`]: {
    fontFamily: fontCss.family.auto.fontFamily,
    height: 300,
    '::before': {
      // placeholder 스타일
      fontStyle: 'normal',
    },
  },
  '& strong': {
    fontWeight: 700,
  },
});

const thumbnailBarCss = css({});

const bottomToolbarCss = css({
  padding: 8,
  border: editorBorder,
});
