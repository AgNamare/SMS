"use client";

import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useBreadcrumb } from "../context/breadcrumb-context";
import React from "react";

export function HeaderClient() {
  const { pageName, breadcrumbs } = useBreadcrumb();

  return (
    <header className='flex h-16 items-center gap-2 border-b bg-white px-4 shadow-sm'>
      <SidebarTrigger className='-ml-1' />
      <Separator
        orientation='vertical'
        className='mr-2 data-[orientation=vertical]:h-4'
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className='text-primary' href='/dashboard'>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={`breadcrumb-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {breadcrumb.href ? (
                  <BreadcrumbLink href={breadcrumb.href}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                ) : (
                  <span className='text-muted-foreground'>
                    {breadcrumb.label}
                  </span>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className='font-semibold text-foreground'>{pageName}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
