export interface ChartTokens {
  status: {
    error: string;
    warning: string;
    success: string;
    neutral: string;
    primary: string;
  };
}

export interface ChartColors {
  series: string[];
  grid: {
    stroke: string;
    dashArray: string;
  };
  axis: {
    stroke: string;
    strokeWidth: number;
    fontSize: number;
    fontFamily: string;
    color: string;
  };
  tooltip: {
    bg: string;
    color: string;
    borderRadius: string;
    padding: string;
    fontSize: number;
  };
}

export const chartTokens: ChartTokens;
export function getChartColors(isDark: boolean): ChartColors; 