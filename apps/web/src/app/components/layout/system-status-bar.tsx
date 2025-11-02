// src/app/components/layout/advanced-system-status-bar.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/src/app/components/ui/badge";
import { Button } from "@/src/app/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  Server,
  Database,
  Network,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu";

interface SystemStatus {
  service: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  latency?: number;
  lastIncident?: string;
  responseTime?: number[];
  uptime: number;
}

export function SystemStatusBar() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      service: "API Gateway",
      status: "operational",
      latency: 42,
      uptime: 99.98,
      responseTime: [45, 38, 42, 47, 41, 39, 44],
    },
    {
      service: "Database Cluster",
      status: "operational",
      latency: 18,
      uptime: 99.99,
      responseTime: [15, 18, 16, 19, 17, 16, 18],
    },
    {
      service: "Auth Service",
      status: "operational",
      latency: 65,
      uptime: 99.97,
      responseTime: [68, 62, 65, 71, 63, 64, 65],
    },
    {
      service: "File Storage",
      status: "degraded",
      latency: 320,
      uptime: 99.85,
      lastIncident: "2 hours ago",
      responseTime: [285, 320, 310, 335, 295, 315, 320],
    },
  ]);

  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString()
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uptime, setUptime] = useState(99.95);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call to status endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate status changes for demo
    setSystemStatus((prev) =>
      prev.map((service) => ({
        ...service,
        latency: service.latency! + (Math.random() * 10 - 5),
        responseTime: service.responseTime
          ?.slice(1)
          .concat([service.latency! + (Math.random() * 10 - 5)]),
      }))
    );

    setLastUpdated(new Date().toLocaleTimeString());
    setIsRefreshing(false);
  };

  const getOverallStatus = () => {
    if (systemStatus.some((s) => s.status === "outage")) return "outage";
    if (systemStatus.some((s) => s.status === "degraded")) return "degraded";
    if (systemStatus.some((s) => s.status === "maintenance"))
      return "maintenance";
    return "operational";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className='w-3 h-3 text-green-500' />;
      case "degraded":
        return <Clock className='w-3 h-3 text-amber-500' />;
      case "outage":
        return <AlertCircle className='w-3 h-3 text-red-500' />;
      case "maintenance":
        return <Server className='w-3 h-3 text-blue-500' />;
      default:
        return <AlertCircle className='w-3 h-3 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-amber-500";
      case "outage":
        return "bg-red-500";
      case "maintenance":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "All Systems Normal";
      case "degraded":
        return "Performance Issues";
      case "outage":
        return "Service Disruption";
      case "maintenance":
        return "Scheduled Maintenance";
      default:
        return "Unknown Status";
    }
  };

  const getLatencyTrend = (responseTime: number[] = []) => {
    if (responseTime.length < 2) return "stable";
    const current = responseTime[responseTime.length - 1];
    const previous = responseTime[responseTime.length - 2];
    return current > previous ? "up" : current < previous ? "down" : "stable";
  };

  const overallStatus = getOverallStatus();

  return (
    <div className='flex items-center gap-4'>
      {/* Uptime Display */}
      <div className='hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200'>
        <div className='flex items-center gap-1.5'>
          <Server className='w-3 h-3 text-green-500' />
          <span className='text-xs font-medium text-gray-700'>Uptime</span>
        </div>
        <span className='text-xs font-mono font-semibold text-gray-900'>
          {uptime}%
        </span>
      </div>

      {/* Last Updated */}
      <div className='hidden md:flex items-center gap-2 text-xs text-gray-500'>
        <Clock className='w-3 h-3' />
        <span>Updated {lastUpdated}</span>
      </div>

      {/* Refresh Button */}
      <Button
        variant='ghost'
        size='sm'
        onClick={refreshStatus}
        disabled={isRefreshing}
        className='h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100'>
        <RefreshCw
          className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
        />
      </Button>

      {/* System Status Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='h-8 gap-2 border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  overallStatus
                )} animate-pulse`}
              />
              <span className='text-sm font-medium text-gray-700'>
                {getStatusText(overallStatus)}
              </span>
            </div>
            <ChevronDown className='w-3 h-3 text-gray-500' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-96 p-0 bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-xl rounded-xl overflow-hidden'>
          {/* Header */}
          <div className='p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-white rounded-lg shadow-sm border border-gray-200'>
                  <Shield className='w-4 h-4 text-gray-700' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>System Health</h3>
                  <p className='text-xs text-gray-600 mt-0.5'>
                    Real-time service monitoring
                  </p>
                </div>
              </div>
              <Badge
                variant='outline'
                className={`
                  ${
                    overallStatus === "operational"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : overallStatus === "degraded"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
                `}>
                {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Services List */}
          <div className='max-h-80 overflow-y-auto'>
            {systemStatus.map((service, index) => {
              const trend = getLatencyTrend(service.responseTime);
              return (
                <div
                  key={service.service}
                  className='flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors'>
                  <div className='flex items-center gap-3 flex-1'>
                    {getStatusIcon(service.status)}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-900 truncate'>
                          {service.service}
                        </span>
                        {service.lastIncident && (
                          <Badge
                            variant='outline'
                            className='bg-amber-50 text-amber-700 border-amber-200 text-xs'>
                            Incident
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center gap-3 mt-1'>
                        <span className='text-xs text-gray-500'>
                          {service.uptime}% uptime
                        </span>
                        {trend !== "stable" && (
                          <div className='flex items-center gap-1'>
                            {trend === "up" ? (
                              <TrendingUp className='w-3 h-3 text-amber-500' />
                            ) : (
                              <TrendingDown className='w-3 h-3 text-green-500' />
                            )}
                            <span
                              className={`text-xs ${
                                trend === "up"
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}>
                              {trend === "up" ? "Rising" : "Falling"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    {service.latency && (
                      <div className='text-right'>
                        <span
                          className={`text-sm font-mono font-semibold ${
                            service.latency < 100
                              ? "text-green-600"
                              : service.latency < 300
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}>
                          {service.latency}ms
                        </span>
                        <div className='text-xs text-gray-500 mt-0.5'>
                          response
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className='p-3 bg-gray-50 border-t border-gray-200'>
            <div className='flex items-center justify-between text-xs text-gray-500'>
              <div className='flex items-center gap-4'>
                <span>Updated {lastUpdated}</span>
                <div className='w-px h-3 bg-gray-300'></div>
                <span>System Uptime: {uptime}%</span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={refreshStatus}
                disabled={isRefreshing}
                className='h-6 px-2 text-xs'>
                <RefreshCw
                  className={`w-3 h-3 mr-1 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
