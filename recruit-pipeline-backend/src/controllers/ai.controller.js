const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs-extra");

const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    const filePath = req.file.path;
    let text = "";

    try {
      if (req.file.mimetype === "application/pdf") {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        text = data.text;
      } else if (
        req.file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        req.file.mimetype === "application/msword"
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      } else {
        await fs.unlink(filePath);
        res.status(400);
        throw new Error("File format not supported. Please upload PDF or DOCX.");
      }
    } catch (parseError) {
      if (filePath) await fs.unlink(filePath);
      throw new Error("Error extracting text from document: " + parseError.message);
    }

    if (!text || text.trim().length < 50) {
      if (filePath) await fs.unlink(filePath);
      res.status(400);
      throw new Error("The resume seems empty or lacks enough information to parse.");
    }

    // Smart text-based parsing (no AI needed)
    const parsedData = {
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      yearsOfExperience: ""
    };

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      parsedData.email = emailMatch[0];
    }

    // Extract phone number (various formats)
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      parsedData.phone = phoneMatch[0];
    }

    // Extract name (usually at the top of resume)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      // First non-empty line is often the name
      parsedData.fullName = lines[0].trim();
    }

    // Extract skills (look for common skill keywords)
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

    // Extract years of experience (look for patterns like "5 years", "3+ years", etc.)
    const expMatch = text.match(/(\d+)[\s+]*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
    if (expMatch) {
      parsedData.yearsOfExperience = expMatch[1];
    }

    // Clean up temp file
    if (filePath) await fs.unlink(filePath);

    res.status(200).json({
      message: "Resume parsed successfully",
      data: parsedData
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  parseResume,
};
