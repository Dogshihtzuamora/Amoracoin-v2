const CriptJs = {}

/* cifras*/
CriptJs.Cesar = {
  cript: function(texto, deslocamento) {
    return texto.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(((char.charCodeAt(0) - base + deslocamento) % 26 + 26) % 26 + base);
      }
      return char; 
    }).join('');
  },

  descript: function(texto, deslocamento) {
    return CriptJs.Cesar.cript(texto, -deslocamento); 
  }
}

CriptJs.Vigenere = {
  cript: function(texto, chave) {
    const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
    chave = chave.toLowerCase();
    return texto.split('').map((char, index) => {
      if (char.match(/[a-zA-Z]/)) {
        const alfabetoAtual = char.toLowerCase() === char ? alfabeto : alfabeto.toUpperCase();
        const charIndex = alfabeto.indexOf(char.toLowerCase());
        const chaveIndex = alfabeto.indexOf(chave[index % chave.length]);
        return alfabetoAtual[(charIndex + chaveIndex) % 26];
      }
      return char;
    }).join('');
  },

  descript: function(texto, chave) {
    const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
    chave = chave.toLowerCase();
    return texto.split('').map((char, index) => {
      if (char.match(/[a-zA-Z]/)) {
        const alfabetoAtual = char.toLowerCase() === char ? alfabeto : alfabeto.toUpperCase();
        const charIndex = alfabeto.indexOf(char.toLowerCase());
        const chaveIndex = alfabeto.indexOf(chave[index % chave.length]);
        return alfabetoAtual[(charIndex - chaveIndex + 26) % 26]; 
      }
      return char;
    }).join('');
  }
}

/*HASHS*/

CriptJs.SHA256 = { 
  K: [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ],
 
  ROTR: function(n, x) {
    return (x >>> n) | (x << (32 - n));
  },

  Ch: function(x, y, z) {
    return (x & y) ^ (~x & z);
  },

  Maj: function(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  },

  Σ0: function(x) {
    return this.ROTR(2, x) ^ this.ROTR(13, x) ^ this.ROTR(22, x);
  },

  Σ1: function(x) {
    return this.ROTR(6, x) ^ this.ROTR(11, x) ^ this.ROTR(25, x);
  },

  σ0: function(x) {
    return this.ROTR(7, x) ^ this.ROTR(18, x) ^ (x >>> 3);
  },

  σ1: function(x) {
    return this.ROTR(17, x) ^ this.ROTR(19, x) ^ (x >>> 10);
  },
 
  preprocess: function(message) {
    let blocks = [];
      
    const utf8 = unescape(encodeURIComponent(message));
       
    for (let i = 0; i < utf8.length * 8 + 64; i += 32) {
      blocks[i >> 5] = 0;
    }
       
    for (let i = 0; i < utf8.length; i++) {
      blocks[i >> 2] |= (utf8.charCodeAt(i) & 0xFF) << (24 - (i % 4) * 8);
    }
       
    blocks[utf8.length >> 2] |= 0x80 << (24 - (utf8.length % 4) * 8);
    blocks[((utf8.length + 64 >> 9) << 4) + 15] = utf8.length * 8;
    
    return blocks;
  },
  
  hash: function(message) {   
    let H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    
    const blocks = this.preprocess(message);
   
    for (let i = 0; i < blocks.length; i += 16) {
      let W = new Array(64);
      let a = H[0], b = H[1], c = H[2], d = H[3],
          e = H[4], f = H[5], g = H[6], h = H[7];
     
      for (let t = 0; t < 64; t++) {
        if (t < 16) {
          W[t] = blocks[i + t] | 0;
        } else {
          W[t] = (this.σ1(W[t - 2]) + W[t - 7] + this.σ0(W[t - 15]) + W[t - 16]) >>> 0;
        }

               let T1 = (h + this.Σ1(e) + this.Ch(e, f, g) + this.K[t] + W[t]) >>> 0;
        let T2 = (this.Σ0(a) + this.Maj(a, b, c)) >>> 0;

        h = g;
        g = f;
        f = e;
        e = (d + T1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (T1 + T2) >>> 0;
      }
     
      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
      H[5] = (H[5] + f) >>> 0;
      H[6] = (H[6] + g) >>> 0;
      H[7] = (H[7] + h) >>> 0;
    }
   
    return H.map(h => 
      ('00000000' + (h >>> 0).toString(16)).slice(-8)
    ).join('');
  }
};

CriptJs.MD5 = {
 
  K: new Int32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ]),

  S: new Int8Array([
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ]),

  rotateLeft: function(x, n) {
    return (x << n) | (x >>> (32 - n));
  },

  toHexString: function(arr) {
    const hexCodes = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      const byte = arr[i];
      str += hexCodes[(byte >>> 4) & 0xF] + hexCodes[byte & 0xF];
    }
    return str;
  },
  
  stringToBytes: function(str) {
    const utf8 = unescape(encodeURIComponent(str));
    const bytes = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
      bytes[i] = utf8.charCodeAt(i);
    }
    return bytes;
  },
 
  hash: function(message) {   
    let state = new Int32Array([
      0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476
    ]);
   
    let bytes = this.stringToBytes(message);
    const originalLength = bytes.length;
   
    const paddingLength = (64 - ((originalLength + 9) % 64)) % 64;
    const newLength = originalLength + 1 + paddingLength + 8;
  
    const paddedBytes = new Uint8Array(newLength);
    paddedBytes.set(bytes, 0);
    paddedBytes[originalLength] = 0x80;
  
    const bitLength = originalLength * 8;
    const dv = new DataView(paddedBytes.buffer, newLength - 8);
    dv.setUint32(0, bitLength >>> 0, true);
    dv.setUint32(4, Math.floor(bitLength / 0x100000000), true);
   
    for (let i = 0; i < newLength; i += 64) {     
      let [a, b, c, d] = state;
     
      const block = new Int32Array(16);
      for (let j = 0; j < 16; j++) {
        const offset = i + (j * 4);
        block[j] = paddedBytes[offset] |
                   (paddedBytes[offset + 1] << 8) |
                   (paddedBytes[offset + 2] << 16) |
                   (paddedBytes[offset + 3] << 24);
      }
    
      for (let j = 0; j < 64; j++) {
        let f, g;

        if (j < 16) {
          f = (b & c) | ((~b) & d);
          g = j;
        } else if (j < 32) {
          f = (d & b) | ((~d) & c);
          g = (5 * j + 1) % 16;
        } else if (j < 48) {
          f = b ^ c ^ d;
          g = (3 * j + 5) % 16;
        } else {
          f = c ^ (b | (~d));
          g = (7 * j) % 16;
        }

        const temp = d;
        d = c;
        c = b;
        const x = (a + f + this.K[j] + block[g]) | 0;
        b = (b + this.rotateLeft(x, this.S[j])) | 0;
        a = temp;
      }
     
      state[0] = (state[0] + a) | 0;
      state[1] = (state[1] + b) | 0;
      state[2] = (state[2] + c) | 0;
      state[3] = (state[3] + d) | 0;
    }
  
    const result = new Uint8Array(16);
    for (let i = 0; i < 4; i++) {
      result[i * 4] = state[i] & 0xFF;
      result[i * 4 + 1] = (state[i] >>> 8) & 0xFF;
      result[i * 4 + 2] = (state[i] >>> 16) & 0xFF;
      result[i * 4 + 3] = (state[i] >>> 24) & 0xFF;
    }

    return this.toHexString(result);
  }
};

/*HASHS*/


                      
