import React from 'react';

interface ChunkErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string;
}

interface ChunkErrorBoundaryState {
  hasError: boolean;
}

export class ChunkErrorBoundary extends React.Component<
  ChunkErrorBoundaryProps,
  ChunkErrorBoundaryState
> {
  declare readonly props: Readonly<ChunkErrorBoundaryProps>;
  declare state: ChunkErrorBoundaryState;
  declare setState: (
    nextState:
      | ChunkErrorBoundaryState
      | ((prevState: Readonly<ChunkErrorBoundaryState>) => ChunkErrorBoundaryState)
  ) => void;

  constructor(props: ChunkErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ChunkErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ChunkErrorBoundaryProps) {
    if (
      this.state.hasError &&
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex-1 flex flex-col items-center justify-center px-6 py-8 bg-[#FAFAF9] text-[#1C1917] text-center">
          <div className="max-w-sm w-full flex flex-col items-center gap-4">
            <p className="text-sm sm:text-base font-medium leading-relaxed text-[#1C1917]">
              Impossible de charger cet écran. Vérifie ta connexion.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-[#A2482B] hover:bg-[#8C3D24] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
