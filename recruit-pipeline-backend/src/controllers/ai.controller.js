const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs-extra");
const Groq = require("groq-sdk");

// Log API key presence (not the actual key for security)
console.log("GROQ_API_KEY loaded:", process.env.GROQ_API_KEY ? `Yes (length: ${process.env.GROQ_API_KEY.length})` : "No");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const parseResume = async (req, res, next) => {
  console.log("=== Starting Resume Parse ===");
  try {
    if (!req.file) {
      console.log("ERROR: No file uploaded");
      res.status(400);
      throw new Error("No file uploaded");
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer
    });

    let text = "";

    try {
      if (req.file.mimetype === "application/pdf") {
        console.log("Processing PDF file...");
        // Handle both memory buffer and file path
        const dataBuffer = req.file.buffer || await fs.readFile(req.file.path);
        const data = await pdf(dataBuffer);
        text = data.text;
      } else if (
        req.file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        req.file.mimetype === "application/msword"
      ) {
        // For DOCX, we need to write buffer to temp file if using memory storage
        if (req.file.buffer) {
          const tempPath = `./uploads/temp_${Date.now()}_${req.file.originalname}`;
          await fs.writeFile(tempPath, req.file.buffer);
          const result = await mammoth.extractRawText({ path: tempPath });
          text = result.value;
          await fs.unlink(tempPath); // Clean up temp file
        } else {
          const result = await mammoth.extractRawText({ path: req.file.path });
          text = result.value;
        }
      } else {
        res.status(400);
        throw new Error("File format not supported. Please upload PDF or DOCX.");
      }
    } catch (parseError) {
      console.error("PDF/DOCX parsing error:", parseError.message);
      throw new Error("Error extracting text from document: " + parseError.message);
    }

    console.log("Text extracted successfully, length:", text.length);

    if (!text || text.trim().length < 50) {
      res.status(400);
      throw new Error("The resume seems empty or lacks enough information to parse.");
    }

    let parsedData = {
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      yearsOfExperience: ""
    };

    // Try AI-based parsing first
    console.log("Starting Groq AI parsing...");
    try {
      const prompt = `Extract the following information from this resume text and return ONLY valid JSON:
{
  "fullName": "candidate's full name",
  "email": "email address",
  "phone": "phone number",
  "skills": "comma-separated technical skills",
  "yearsOfExperience": "number of years only (e.g., '5')"
}

Resume text:
${text.substring(0, 3000)}

Return only the JSON object, no additional text.`;

      console.log("Calling Groq API with llama-3.3-70b-versatile model...");
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        max_tokens: 500,
      });
      console.log("Groq API response received successfully");

      const response = chatCompletion.choices[0]?.message?.content || "";
      
      // Try to extract JSON from response
      console.log("Raw API Response:", response.substring(0, 100) + "...");
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log("JSON match found, parsing...");
        const aiParsed = JSON.parse(jsonMatch[0]);
        console.log("JSON parsed successfully");
        parsedData = {
          fullName: aiParsed.fullName || "",
          email: aiParsed.email || "",
          phone: aiParsed.phone || "",
          skills: aiParsed.skills || "",
          yearsOfExperience: aiParsed.yearsOfExperience || ""
        };
        console.log("Parsed Data populated");
      } else {
        console.warn("No JSON match found in response");
      }
    } catch (aiError) {
      console.warn("AI parsing failed, falling back to regex:", aiError.message);
      
      // Fallback to regex-based parsing
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        parsedData.email = emailMatch[0];
      }

      const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (phoneMatch) {
        parsedData.phone = phoneMatch[0];
      }

      const lines = text.split('\n').filter(line => line.trim().length > 0);
      if (lines.length > 0) {
        parsedData.fullName = lines[0].trim();
      }

      const skillKeywords = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
        'HTML', 'CSS', 'MongoDB', 'SQL', 'Docker', 'AWS', 'Git', 'Angular', 
        'Vue', 'Express', 'Django', 'Spring', 'Kubernetes', 'Redis', 'PostgreSQL',
        'GraphQL', 'REST API', 'Microservices', 'Machine Learning', 'AI', 'DevOps'
      ];
      
      const foundSkills = [];
      skillKeywords.forEach(skill => {
        const regex = new RegExp(skill, 'gi');
        if (regex.test(text)) {
          foundSkills.push(skill);
        }
      });
      parsedData.skills = foundSkills.join(', ');

      const expMatch = text.match(/(\d+)[\s+]*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
      if (expMatch) {
        parsedData.yearsOfExperience = expMatch[1];
      }
    }

    console.log("Sending success response...");
    res.status(200).json({
      message: "Resume parsed successfully",
      data: parsedData
    });
    console.log("Response sent!");

  } catch (error) {
    console.error("=== RESUME PARSE ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    next(error);
  }
};

module.exports = {
  parseResume,
};

