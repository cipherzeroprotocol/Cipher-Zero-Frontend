// dataUtils.ts

// Example of serialization using JSON for dataUtils.ts
export function serializeData(data: any): string {
    return JSON.stringify(data);
  }
  
  // Example of deserialization using JSON for dataUtils.ts
  export function deserializeData(serializedData: string): any {
    return JSON.parse(serializedData);
  }
  
  // Validate JSON data format
  export function validateJsonFormat(data: string): boolean {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Validate if a string is a valid JSON object
  export function isValidJsonObject(str: string): boolean {
    try {
      const obj = JSON.parse(str);
      return typeof obj === 'object' && obj !== null;
    } catch (e) {
      return false;
    }
  }
  
  // Check if two objects are deeply equal
  export function deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  
  // Merge two objects deeply
  export function mergeObjects(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (source && typeof source === 'object') {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object') {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeObjects(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      });
    }
    return mergeObjects(target, ...sources);
  }