"use client";

import {
  Calendar,
  ClipboardList,
  FileText,
  Grid3X3,
  LogOut,
  Settings,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/store/slices/AuthSlice";
import { clearSelectedPatient } from "@/store/slices/CurrentPatient";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { log } from "console";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: <LayoutGrid />,
  },
  // {
  //   title: "Schedule",
  //   url: "/dashboard/schedule",
  //   icon: (
  //     <svg
  //       style={{ width: "28px", height: "29px" }}
  //       viewBox="0 0 33 31"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         d="M22.6733 4.24865L27.9934 4.23308C28.3461 4.23205 28.6848 4.36008 28.9349 4.589C29.185 4.81792 29.326 5.12898 29.327 5.45376L29.3843 25.0468C29.3853 25.3716 29.2461 25.6835 28.9973 25.9138C28.7486 26.1442 28.4106 26.2742 28.0579 26.2753L4.11752 26.3453C3.76478 26.3464 3.4261 26.2183 3.176 25.9894C2.9259 25.7605 2.78487 25.4494 2.78391 25.1247L2.72657 5.53161C2.72562 5.20683 2.86484 4.89495 3.11359 4.66457C3.36235 4.43419 3.70027 4.30418 4.05301 4.30315L9.37309 4.28758L9.36593 1.83845L12.026 1.83066L12.0331 4.27979L20.0133 4.25644L20.0061 1.80731L22.6661 1.79952L22.6733 4.24865ZM5.40453 11.6467L5.44037 23.8923L26.7207 23.83L26.6849 11.5844L5.40453 11.6467ZM8.07891 16.5371L14.729 16.5177L14.7434 21.4159L8.09325 21.4354L8.07891 16.5371Z"
  //         fill="currentColor"
  //       />
  //     </svg>
  //   ),
  // },
  {
    title: "Registration",
    url: "/dashboard/registration",
    icon: (
      <svg
        style={{ width: "28px", height: "29px" }}
        viewBox="0 0 37 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.3804 7.13846H9.63581C8.34163 7.13846 7.29248 8.1876 7.29248 9.48179V32.098C7.29248 33.3922 8.34163 34.4414 9.63581 34.4414H27.3804C28.6746 34.4414 29.7237 33.3922 29.7237 32.098V9.48179C29.7237 8.1876 28.6746 7.13846 27.3804 7.13846Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.6041 3.60806H20.412C21.1739 3.61214 21.9033 3.91767 22.4406 4.45788C22.9779 4.99809 23.2795 5.72905 23.2795 6.49098V7.13848H13.7212V6.49098C13.7212 5.72638 14.0249 4.9931 14.5656 4.45245C15.1062 3.9118 15.8395 3.60806 16.6041 3.60806Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.2588 24.5593H21.9075"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.2588 28.5522H18.5313"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5005 12.411V17.8068"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.1986 15.1089H15.8027"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Referrals",
    url: "/dashboard/referrals",
    icon: (
      <svg
        style={{ width: "28px", height: "29px" }}
        viewBox="0 0 37 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_448_396)">
          <path
            d="M12.9005 16.4412L23.965 20.7718M25.6142 18.1734C27.2573 18.4682 28.7556 19.303 29.8726 20.5458C30.9895 21.7887 31.6613 23.3689 31.7821 25.0368C31.8965 26.7277 31.439 28.4078 30.4834 29.8062C29.5278 31.2046 28.1298 32.2397 26.515 32.7445C25.4737 33.0698 24.3738 33.162 23.293 33.0149C22.2122 32.8678 21.1768 32.4848 20.2598 31.893M30.7142 22.0964L20.8121 28.8434M24.0463 4.28782C27.1008 5.48524 28.6075 8.93825 27.4116 12.0003L20.5022 29.6905C19.3063 32.7526 15.8605 34.2641 12.806 33.0667C9.75145 31.8693 8.24472 28.4163 9.44067 25.3543L16.35 7.66403C17.546 4.602 20.9917 3.09041 24.0463 4.28782Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_448_396">
            <rect
              width="36.3401"
              height="33.4588"
              fill="white"
              transform="translate(0.568359 0.978577) rotate(-0.167686)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    title: "Notes",
    url: "/dashboard/notes",
    icon: (
      <svg
        style={{ width: "28px", height: "29px" }}
        viewBox="0 0 34 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.48169 3.44101C6.42814 3.44101 5.41774 3.85953 4.67277 4.6045C3.9278 5.34947 3.50928 6.35987 3.50928 7.41342V27.6417C3.50928 28.6953 3.9278 29.7057 4.67277 30.4506C5.41774 31.1956 6.42814 31.6141 7.48169 31.6141H9.41154V3.44101H7.48169Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.41113 3.44101V31.6141H28.3576C28.9254 31.6141 29.47 31.3885 29.8716 30.987C30.2731 30.5855 30.4987 30.0408 30.4987 29.473V5.52582C30.484 4.96777 30.252 4.43753 29.852 4.04809C29.452 3.65865 28.9158 3.44082 28.3576 3.44101H9.41113Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.8219 15.4568H22.0186V11.6535H17.8912V15.4568H14.0737V19.5983H17.8912V23.4017H22.0186V19.5983H25.8219V15.4568Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  // {
  //   title: "Providers",
  //   url: "/dashboard/providers",
  //   icon: (
  //     <svg
  //       style={{ width: "28px", height: "29px" }}
  //       viewBox="0 0 44 39"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <g clipPath="url(#clip0_450_92)">
  //         <path
  //           d="M18.1248 27.919H26.7967C27.594 27.9167 28.358 27.599 28.9219 27.0352C29.4857 26.4713 29.8035 25.7073 29.8058 24.9099C29.8012 24.1141 29.4825 23.3522 28.9189 22.7903C28.3553 22.2283 27.5925 21.9117 26.7967 21.9094H21.2986C20.0649 21.8949 18.8402 21.6961 17.6652 21.3198C15.4886 20.8515 11.9678 20.8255 10.3549 24.9099H6.88615M29.7624 24.9099L37.567 20.3138C38.2481 19.9012 39.0652 19.7753 39.8389 19.9639C40.6127 20.1524 41.2799 20.64 41.6948 21.3197C42.106 22.0004 42.2319 22.8158 42.0452 23.5887C41.8585 24.3617 41.3742 25.0297 40.6976 25.4475L30.4909 33.1308C28.6712 34.5002 26.4551 35.2399 24.1777 35.238H6.83407M26.8661 11.3038L24.7413 13.4371C24.7284 13.4505 24.7129 13.4611 24.6958 13.4684C24.6787 13.4756 24.6602 13.4793 24.6416 13.4793C24.623 13.4793 24.6048 13.4756 24.5876 13.4684C24.5705 13.4611 24.5548 13.4505 24.5419 13.4371L23.2324 11.2951H17.5092C17.0058 12.6047 16.1172 13.7309 14.9607 14.5251C13.8043 15.3193 12.4343 15.7442 11.0313 15.7438C9.19138 15.7438 7.4267 15.0129 6.12567 13.7118C4.82464 12.4108 4.09384 10.6462 4.09384 8.80629C4.09384 6.96636 4.82464 5.20178 6.12567 3.90076C7.4267 2.59973 9.19138 1.86882 11.0313 1.86882C12.4332 1.8677 13.8025 2.29137 14.9588 3.08396C16.1152 3.87655 17.0045 5.00087 17.5092 6.3088H30.2654L33.526 9.07512L29.1901 13.5584L26.8661 11.3471M6.85143 23.375C6.85143 23.2508 6.80206 23.1317 6.71424 23.0438C6.62642 22.956 6.50731 22.9067 6.38312 22.9067H1.81304C1.68884 22.9067 1.56974 22.956 1.48192 23.0438C1.3941 23.1317 1.34473 23.2508 1.34473 23.375V36.7556C1.34473 36.8798 1.3941 36.9989 1.48192 37.0867C1.56974 37.1746 1.68884 37.2239 1.81304 37.2239H6.38312C6.50731 37.2239 6.62642 37.1746 6.71424 37.0867C6.80206 36.9989 6.85143 36.8798 6.85143 36.7556V23.375Z"
  //           stroke="currentColor"
  //           strokeWidth="3"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //         />
  //         <path
  //           d="M9.16657 10.2372C10.2011 10.2372 11.0397 9.39853 11.0397 8.36404C11.0397 7.32954 10.2011 6.49092 9.16657 6.49092C8.13208 6.49092 7.29346 7.32954 7.29346 8.36404C7.29346 9.39853 8.13208 10.2372 9.16657 10.2372Z"
  //           fill="currentColor"
  //         />
  //       </g>
  //       <defs>
  //         <clipPath id="clip0_450_92">
  //           <rect
  //             width="43.4372"
  //             height="38"
  //             fill="white"
  //             transform="translate(0.000488281 0.524689)"
  //           />
  //         </clipPath>
  //       </defs>
  //     </svg>
  //   ),
  // },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: (
      <svg
        style={{ width: "28px", height: "29px" }}
        viewBox="0 0 36 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.77246 22.8572C5.16995 21.9041 4.70077 20.8846 4.37609 19.823C5.07498 19.4932 5.66127 18.9919 6.07008 18.3745C6.4789 17.7572 6.69431 17.0478 6.69249 16.3249C6.69067 15.602 6.47168 14.8937 6.05976 14.2784C5.64784 13.6632 5.05904 13.1649 4.35849 12.8387C4.99354 10.7018 6.20889 8.74872 7.89005 7.16334C8.54961 7.55553 9.31425 7.772 10.0994 7.7888C10.8845 7.8056 11.6594 7.62207 12.3384 7.25852C13.0175 6.89498 13.5741 6.36559 13.9467 5.72895C14.3194 5.09231 14.4935 4.37324 14.4498 3.65133C16.7778 3.09019 19.2224 3.08393 21.5532 3.63315C21.5141 4.3553 21.6927 5.07322 22.0694 5.70749C22.446 6.34175 23.006 6.86763 23.6872 7.22691C24.3685 7.5862 25.1446 7.76489 25.9295 7.74322C26.7145 7.72154 27.4777 7.50034 28.1348 7.10409C28.9584 7.87235 29.6902 8.74668 30.3059 9.72323C30.9231 10.6998 31.3857 11.7186 31.7023 12.7574C31.0034 13.0872 30.4171 13.5885 30.0083 14.2059C29.5995 14.8232 29.3841 15.5326 29.3859 16.2555C29.3877 16.9785 29.6067 17.6867 30.0186 18.302C30.4306 18.9172 31.0194 19.4155 31.7199 19.7417C31.0849 21.8786 29.8695 23.8317 28.1883 25.4171C27.5288 25.0249 26.7641 24.8084 25.979 24.7916C25.1939 24.7748 24.419 24.9583 23.74 25.3219C23.0609 25.6854 22.5043 26.2148 22.1317 26.8515C21.759 27.4881 21.5849 28.2072 21.6286 28.9291C19.3006 29.4902 16.856 29.4965 14.5252 28.9473C14.5643 28.2251 14.3857 27.5072 14.009 26.8729C13.6324 26.2387 13.0724 25.7128 12.3912 25.3535C11.7099 24.9942 10.9338 24.8155 10.1489 24.8372C9.36395 24.8589 8.60071 25.0801 7.94365 25.4763C7.10289 24.6911 6.37337 23.811 5.77246 22.8572ZM13.803 23.0897C15.3171 23.8881 16.4576 25.1732 17.0056 26.6985C17.7137 26.7579 18.4245 26.7571 19.1323 26.6936C19.6717 25.1649 20.8052 23.8731 22.3151 23.0661C23.824 22.2566 25.6041 21.9886 27.3139 22.3134C27.7237 21.7793 28.0767 21.2101 28.3701 20.6149C27.2024 19.4211 26.5548 17.8722 26.5513 16.2653C26.5465 14.6195 27.2088 13.0801 28.3446 11.9051C28.0457 11.3119 27.6878 10.7453 27.2756 10.2128C25.5689 10.5474 23.7884 10.2902 22.2754 9.49072C20.7613 8.69231 19.6208 7.40721 19.0728 5.88187C18.3647 5.82256 17.6539 5.82333 16.9461 5.88679C16.4067 7.41553 15.2732 8.70731 13.7633 9.51432C12.2544 10.3238 10.4743 10.5918 8.76454 10.267C8.35549 10.8015 8.00186 11.3702 7.70833 11.9655C8.87597 13.1593 9.52361 14.7082 9.52706 16.3151C9.53188 17.9609 8.8696 19.5003 7.73382 20.6753C8.03273 21.2685 8.39058 21.8351 8.8028 22.3676C10.5095 22.0331 12.29 22.2902 13.803 23.0897ZM18.0507 20.2088C16.9219 20.2121 15.8381 19.8024 15.0378 19.0699C14.2375 18.3373 13.7862 17.3419 13.7831 16.3027C13.7801 15.2634 14.2256 14.2654 15.0216 13.5281C15.8176 12.7909 16.899 12.3749 18.0277 12.3716C19.1565 12.3683 20.2403 12.778 21.0406 13.5105C21.8409 14.2431 22.2922 15.2385 22.2953 16.2777C22.2983 17.317 21.8528 18.3151 21.0568 19.0523C20.2608 19.7895 19.1794 20.2055 18.0507 20.2088ZM18.043 17.5964C18.4193 17.5953 18.7797 17.4566 19.0451 17.2109C19.3104 16.9652 19.4589 16.6325 19.4579 16.2861C19.4569 15.9396 19.3064 15.6078 19.0397 15.3636C18.7729 15.1195 18.4116 14.9829 18.0354 14.984C17.6591 14.9851 17.2987 15.1238 17.0333 15.3695C16.768 15.6153 16.6195 15.9479 16.6205 16.2944C16.6215 16.6408 16.772 16.9726 17.0387 17.2168C17.3055 17.4609 17.6668 17.5975 18.043 17.5964Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  function logOut() {
    console.log("looet out");

    dispatch(logout());
    dispatch(clearSelectedPatient());
    console.log("looge out");
    toast.success("Logged out successfully!");
    document.cookie = "token=; path=/; max-age=0";
    if (typeof window !== undefined) {
      window.location.href = "/";
    }
    console.log();
  }
  return (
    <Sidebar className="bg-gradient-to-b from-blue-400 to-blue-600 border-r-0">
      <SidebarContent className="bg-gradient-to-b from-blue-400 to-blue-600 justify-center border-r-0">
        <SidebarGroup className="pt-8">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 ">
              {menuItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="inline-flex justify-center"
                >
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/"
                        ? pathname === "/" || pathname === "/dashboard"
                        : pathname.startsWith(item.url)
                    }
                    className="text-white  w-fit hover:bg-white/20 data-[active=true]:bg-white/30 data-[active=true]:text-white h-16 text-sm px-2 inline-flex items-center transition-all duration-200"
                  >
                    <Link
                      href={item.url}
                      className="flex flex-col items-center gap-2 py-2"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-medium text-white text-center leading-tight">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className="inline-flex justify-center">
                <SidebarMenuButton
                  className="text-white hover:bg-white/20 h-16 text-sm justify-center px-4 transition-all duration-200 w-fit"
                  onClick={() => logOut()}
                >
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium text-white text-center leading-tight">
                      Log Out
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
