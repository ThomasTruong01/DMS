import { useEffect, useState } from "react";
import mammoth from "mammoth";

export default function WordViewer({ file }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
