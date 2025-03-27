import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";

const RichTextEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [letterId, setLetterId] = useState(null);

  const apiKey =
    import.meta.env.VITE_TINYMCE_API_KEY || process.env.REACT_APP_TINYMCE_API_KEY;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://lettereditorbackend-8c5b.onrender.com/auth/login/success", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("User not authenticated");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent); // Store content in rich text format
  };

  const handleSaveDraft = async () => {
    if (!user) {
      alert("Please log in to save your letter.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert("Both title and content are required.");
      return;
    }

    try {
      const response = await fetch("https://lettereditorbackend-8c5b.onrender.com/letters/draft", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Letter saved as draft!");
        setLetterId(result._id);
      } else {
        alert("Error saving draft: " + result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save the draft.");
    }
  };

  const handleSaveToDrive = async () => {
    if (!letterId) {
      alert("Please save as draft first before uploading to Google Drive.");
      return;
    }

    try {
      const response = await fetch("https://lettereditorbackend-8c5b.onrender.com/letters/save-to-drive", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Letter saved to Google Drive successfully!");
      } else {
        alert("Error saving to Drive: " + result.message);
      }
    } catch (error) {
      console.error("Drive save error:", error);
      alert("Failed to save the letter to Google Drive.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user ? `Welcome, ${user.name}` : "Please log in to save letters"}
      </Typography>

      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={handleTitleChange}
      />

      <Editor
        apiKey={apiKey}
        init={{
          height: 300,
          menubar: false,
          plugins: "advlist autolink lists charmap preview searchreplace visualblocks code fullscreen insertdatetime table help wordcount",
          toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
          branding: false,
          forced_root_block: "p", // Keep paragraphs as default
          force_p_newlines: true,
          force_br_newlines: false,
          convert_newlines_to_brs: false,
          content_style: "body { font-family: Arial, sans-serif; font-size: 14px; }",
        }}
        value={content}
        onEditorChange={handleEditorChange}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveDraft} disabled={!user}>
            Save as Draft
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveToDrive} disabled={!letterId}>
            Save to Google Drive
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RichTextEditor;
