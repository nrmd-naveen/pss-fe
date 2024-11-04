interface BeatDotLoaderProps {
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'secondary' | 'accent'
  }
  
  export default function Loader({ size = 'medium', color = 'primary' }: BeatDotLoaderProps) {
    const sizeClasses = {
      small: 'w-2 h-2',
      medium: 'w-3 h-3',
      large: 'w-4 h-4'
    }
  
    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      accent: 'bg-accent'
    }
  
    const containerSizeClasses = {
      small: 'gap-1',
      medium: 'gap-2',
      large: 'gap-3'
    }
  
    return (
      <div className="flex items-center justify-center" role="status">
        <div className={`flex ${containerSizeClasses[size]}`}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-beat-pulse`}
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animation: `beatPulse 0.8s infinite ${index * 0.2}s`
              }}
            ></div>
          ))}
        </div>
        <span className="sr-only">Loading...</span>
        <style jsx>{`
          @keyframes beatPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(0.75);
              opacity: 0.75;
            }
          }
        `}</style>
      </div>
    )
  }