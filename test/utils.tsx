import React from "react"
import {
  RouterContext,
  BlitzRouter,
  Ctx,
  AuthenticatedSessionContext,
  PublicData,
  SessionContext,
} from "blitz"
import { render as defaultRender } from "@testing-library/react"
import { renderHook as defaultRenderHook } from "@testing-library/react-hooks"
import { User } from "@prisma/client"
import { merge } from "lodash"

export * from "@testing-library/react"

// --------------------------------------------------------------------------------
// This file customizes the render() and renderHook() test functions provided
// by React testing library. It adds a router context wrapper with a mocked router.
//
// You should always import `render` and `renderHook` from this file
//
// This is the place to add any other context providers you need while testing.
// --------------------------------------------------------------------------------

// --------------------------------------------------
// render()
// --------------------------------------------------
// Override the default test render with our own
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
export function render(ui: RenderUI, { wrapper, router, ...options }: RenderOptions = {}) {
  if (!wrapper) {
    // Add a default context wrapper if one isn't supplied from the test
    wrapper = ({ children }) => (
      <RouterContext.Provider value={{ ...mockRouter, ...router }}>
        {children}
      </RouterContext.Provider>
    )
  }
  return defaultRender(ui, { wrapper, ...options })
}

// --------------------------------------------------
// renderHook()
// --------------------------------------------------
// Override the default test renderHook with our own
//
// You can override the router mock like this:
//
// const result = renderHook(() => myHook(), {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
export function renderHook(
  hook: RenderHook,
  { wrapper, router, ...options }: RenderHookOptions = {}
) {
  if (!wrapper) {
    // Add a default context wrapper if one isn't supplied from the test
    wrapper = ({ children }) => (
      <RouterContext.Provider value={{ ...mockRouter, ...router }}>
        {children}
      </RouterContext.Provider>
    )
  }
  return defaultRenderHook(hook, { wrapper, ...options })
}

export const mockRouter: BlitzRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  params: {},
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
}

type DefaultParams = Parameters<typeof defaultRender>
type RenderUI = DefaultParams[0]
type RenderOptions = DefaultParams[1] & { router?: Partial<BlitzRouter> }

type DefaultHookParams = Parameters<typeof defaultRenderHook>
type RenderHook = DefaultHookParams[0]
type RenderHookOptions = DefaultHookParams[1] & { router?: Partial<BlitzRouter> }

export type BlitzGuardCtx = Ctx & { session: Partial<SessionContext> } & { securedByGuard: boolean }

export function getSession({ user, ...rest }: Partial<BlitzGuardCtx> & { user?: User } = {}) {
  const defaults = {
    session: {
      authorize: jest.fn(),
      isAuthorized: jest.fn(() => !!user),
      userId: user?.id,
      roles: user ? ["user"] : [],
      getPrivateData: jest.fn(),
      create: jest.fn(),
      handle: null,
      publicData: {
        roles: user ? ["user"] : [],
        userId: user?.id,
      },
      revoke: jest.fn(),
      revokeAll: jest.fn(),
      setPrivateData: jest.fn(),
      setPublicData: jest.fn(),
    },
    securedByGuard: true,
  }

  return merge(defaults, rest) as BlitzGuardCtx
}
