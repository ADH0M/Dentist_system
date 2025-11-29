import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest ,res:NextResponse) {
    try {   
            console.log('throw');
            const {columnId, newOrder } = await req.json();
            
            
            return NextResponse.json({
                data:'done',
            })
    } catch (error) {
            console.log(error);
            
    }
} 