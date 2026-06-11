import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "foods.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Окууда ката" }, { status: 500 });
  }
}

// PUT - жазуу (өзгөртүү)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Ийгиликтүү жазылды" });
  } catch (error) {
    return NextResponse.json({ error: "Жазууда ката" }, { status: 500 });
  }
}
