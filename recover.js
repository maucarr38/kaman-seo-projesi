const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Halis Efe Elden\\.gemini\\antigravity-ide\\brain\\2941098a-5f8e-477a-afeb-51cb68ddcf05\\.system_generated\\logs\\transcript.jsonl';

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      if (data.type === 'TOOL_CALL') {
        for (const call of data.tool_calls || []) {
          if (call.name === 'default_api:write_to_file' && call.arguments.TargetFile && call.arguments.TargetFile.endsWith('style.css')) {
            const content = call.arguments.CodeContent;
            if (content && content.length > 500 && !content.includes('Ultra-Pro') && !content.includes('Bento Box') && !content.includes('koyu (Dark) tema CSS') && !content.includes('koyu tema yerine açık/beyaz tema')) {
               console.log("Found an old write_to_file of style.css!");
               fs.writeFileSync('recovered_style.css', content);
            }
          }
        }
      }
      if (data.type === 'TOOL_RESPONSE') {
        for (const res of data.tool_responses || []) {
            if (res.name === 'default_api:view_file' && typeof res.output === 'string' && res.output.includes('font-family') && res.output.includes('{')) {
                // Could be the original file if I viewed it
                 if (res.output.split('\n').length > 500 && res.output.includes('.fade-in')) {
                     console.log("Found original style.css from view_file!");
                     fs.writeFileSync('original_style.css', res.output);
                 }
            }
        }
      }
      if (data.type === 'USER_INPUT' && typeof data.content === 'string') {
          // Maybe it was in a user prompt? Unlikely to be 837 lines but possible.
      }
    } catch (e) {
      // ignore JSON parse errors
    }
  }
  console.log("Done extracting.");
}

extract();
