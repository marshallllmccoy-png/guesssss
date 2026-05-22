'use client';

import { Component, ReactNode } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <GlassCard className="p-10 text-center max-w-sm w-full">
            <div className="text-5xl mb-6">😵</div>
            <h2 className="text-xl font-semibold text-white/70 mb-3">出错了</h2>
            <p className="text-sm text-white/30 mb-6">
              游戏遇到了意外错误，请刷新页面重试
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 text-sm text-violet-300 border border-violet-400/30 rounded-xl hover:bg-violet-500/10 transition-colors"
            >
              刷新页面
            </button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
