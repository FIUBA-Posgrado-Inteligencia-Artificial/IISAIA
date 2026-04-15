---
name: yt-transcript-to-md
description: Use when the user provides a YouTube link and asks to extract, transcribe, or process the video content into markdown files, or says "transcribe this video", "extract this video", "process this YouTube link"
---

# YouTube Transcript to Markdown

Extracts a YouTube video's full transcript and transforms it into a set of topic-organized markdown files. Preserves the speaker's original vocabulary, syntax, and way of explaining as closely as possible.

## Config

| Key | Value |
|-----|-------|
| Script | `tools/yt-transcript.py` |
| Run | `uv run python tools/yt-transcript.py` |
| Slice size | ~500 lines per Read call |

## Flow

### 1. Gather Inputs

Extract the YouTube URL from the user's message. Ask the user for the output directory path.

### 2. Fetch Transcript

Run the Python script to download the full transcript with timestamps:

```bash
uv run python tools/yt-transcript.py "<youtube_url>" --timestamps -o "<output_dir>/transcript.txt"
```

If the command fails, report the error to the user and stop. Common failures:
- No transcript available for the video
- Invalid URL or video ID
- Network error

After success, confirm the transcript was saved and report the line count:

```bash
wc -l "<output_dir>/transcript.txt"
```

### 3. Process Transcript in Slices

Read the transcript file in slices of ~500 lines using the Read tool with `offset` and `limit` parameters.

**Initialize state before starting:**
- `current_topic_title`: null (no topic yet)
- `current_topic_content`: empty buffer
- `completed_topics`: empty list (each entry: title, filename, key_terms)
- `topic_counter`: 1

**For each slice:**

1. Read the slice: `Read(file_path="<output_dir>/transcript.txt", offset=<current_offset>, limit=500)`
2. Analyze the text for topic shifts — a topic boundary is where the speaker moves to a substantially different subject
3. If a topic boundary is found:
   a. Everything before the boundary belongs to the current topic — append to `current_topic_content`
   b. Finalize the current topic: write its `.md` file (see Section 4)
   c. Add it to `completed_topics` with title, filename, and 3-7 key terms
   d. Increment `topic_counter`
   e. Start a new topic with the content after the boundary
4. If no boundary is found: append the entire slice to `current_topic_content`
5. Move offset forward by 500 and repeat until the entire file is read

**After the last slice:** finalize the last topic (write its file, add to `completed_topics`).

**Boundary detection guidance:**
- Err toward fewer, larger topics rather than many small ones
- A brief aside or example is NOT a new topic — only a genuine subject shift counts
- If the speaker revisits a previous subject, treat it as a new topic file (do not merge non-contiguous segments)

### 4. Write Topic Files

When a topic is finalized, write it to `<output_dir>/NN-topic-slug.md` where:
- `NN` is the zero-padded topic counter (01, 02, 03...)
- `topic-slug` is a kebab-case short name derived from the topic title

**File format:**

```markdown
# Topic Title

[Content paragraphs]
```

**Content rules — these are critical:**
- Preserve the speaker's original vocabulary, phrasing, and way of explaining concepts
- Remove filler words (um, uh, you know, like) and false starts/stutters
- Remove pure repetition where the speaker restates the exact same thing immediately
- Reorganize the stream of speech into readable paragraphs with logical grouping
- Keep the original language of the video (do not translate)
- Do NOT summarize — include all substantive content the speaker communicated
- Do NOT paraphrase — use the speaker's words, not synonyms or rewording
- Do NOT add interpretation, commentary, or editorial notes
- Remove timestamps from the output content

### 5. Write Index File

After all topics are processed, write `<output_dir>/index.md`:

```markdown
# [Video Title or Description]

Source: [YouTube URL]
Language: [detected language from transcript]
Duration: [approximate, derived from last timestamp in transcript]
Topics: [N] files

## Contents

| # | Topic | Key Terms | File |
|---|-------|-----------|------|
| 1 | First topic title | term1, term2, term3 | [01-first-topic.md](01-first-topic.md) |
| 2 | Second topic title | term4, term5, term6 | [02-second-topic.md](02-second-topic.md) |
```

Use the `completed_topics` list built during processing. Each row has:
- Sequential number
- Topic title
- 3-7 key terms or concepts from that section
- Relative markdown link to the topic file

### 6. Report Completion

Tell the user:
- How many topic files were created
- The path to `index.md`
- List the topic titles
