import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { UserDetails, UserHandle } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const usersDetails = await UserDetails.find({}).sort({ _id: -1 });

    const usersHandleDetails = await Promise.all(
      usersDetails.map(async (user) => {
        const userHandle = await UserHandle.findOne({ userId: user._id });

        return {
          following: userHandle?.following.length,
          followers: userHandle?.followers,
          avatar: user.avatar,
          name: user.name,
          userId: user._id,
        };
      })
    );

    return NextResponse.json<ApiResponse<typeof usersHandleDetails>>({
        success : true,
        status : 200,
        message : "Users fetched successfully",
        data : usersHandleDetails
    },{
        status : 200
    })

  } catch (error) {
    console.log(error);
    
    return NextResponse.json<ApiResponse>({
        success : false,
        status : 500,
        message : "Internal Server Error"
    },{
        status : 500
    })
  }
}
