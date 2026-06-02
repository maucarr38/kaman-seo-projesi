const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Halis Efe Elden\\.gemini\\antigravity-ide\\brain\\2941098a-5f8e-477a-afeb-51cb68ddcf05\\.system_generated\\logs\\transcript.jsonl';

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let longestCSS = '';
  
  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      
      // Look in tool responses
      if (data.type === 'TOOL_RESPONSE') {
        for (const res of data.tool_responses || []) {
            if (res.name === 'default_api:view_file' && typeof res.output === 'string') {
                if (res.output.includes('{') && res.output.includes('}')) {
                    if (res.output.length > longestCSS.length && res.output.includes('body')) {
                        longestCSS = res.output;
                    }
                }
            }
        }
      }
      
      // Look in USER_INPUT
      if (data.type === 'USER_INPUT' && typeof data.content === 'string') {
          if (data.content.includes('{') && data.content.includes('}')) {
             if (data.content.length > longestCSS.length) {
                 longestCSS = data.content;
             }
          }
      }

    } catch (e) {
      // ignore JSON parse errors
    }
  }
  
  if (longestCSS.length > 0) {
      fs.writeFileSync('extracted_longest.txt', longestCSS);
      console.log('Extracted content of length ' + longestCSS.length);
  } else {
      console.log('Nothing found.');
  }
}

extract();
