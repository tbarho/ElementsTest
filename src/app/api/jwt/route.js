import fs from 'fs';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function POST(req, res) {
  try {
    const body = await req.json();
    
    const payload = {
      partner: process.env.SHIPENGINE_PARTNER_ID,
      tenant: body.sellerId,
    };
    
    const secretKey = fs.readFileSync('certs/private.pem', 'utf-8');
    
    if (!secretKey) throw new Error('Missing secret key');
    
    const token = sign(payload, secretKey, {
      algorithm: 'RS256',
      expiresIn: 3600,
      issuer: process.env.PLATFORM_TOKEN_ISSUER,
      keyid: process.env.PLATFORM_TOKEN_KEY_ID,
    });


    return NextResponse.json(token);
  } catch (e) {
    console.log(e, res);
    return NextResponse.status(500).json({ error: e, status: 'Failed to generate token' });
  }
}
