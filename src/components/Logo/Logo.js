import React from 'react';
import { Leaf } from 'lucide-react';

const Logo = ({
  variant = 'light',
  size = 'md',
  animated = false,
  className = ''
}) => {
  // Size classes
  const sizes = {
    sm: {
      container: 'h-8',
      icon: 'w-5 h-5',
      text: 'text-lg'
    },
    md: {
      container: 'h-10',
      icon: 'w-6 h-6',
      text: 'text-xl'
    },
    lg: {
      container: 'h-12',
      icon: 'w-7 h-7',
      text: 'text-2xl'
    },
    xl: {
      container: 'h-16',
      icon: 'w-8 h-8',
      text: 'text-3xl'
    }
  };

  // Color variants
  const variants = {
    light: {
      icon: 'text-emerald-500',
      text: 'text-white',
      textHover: 'group-hover:text-emerald-100'
    },
    dark: {
      icon: 'text-emerald-500',
      text: 'text-gray-900 dark:text-white',
      textHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
    },
    colored: {
      icon: 'text-white',
      text: 'text-emerald-500',
      textHover: 'group-hover:text-emerald-600'
    }
  };

  // Get classes for current size and variant
  const sizeClasses = sizes[size] || sizes.md;
  const variantClasses = variants[variant] || variants.light;

  return (
    <div className={"group flex items-center gap-2 " + sizeClasses.container + " " + className}>
      {/* Icon */}
      <div className={"relative flex items-center justify-center " + (animated ? "animate-float" : "")}>
        <div className={"absolute inset-0 bg-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity " + 
          (animated ? "animate-pulse" : "")} />
        <div className={"relative p-2 bg-white dark:bg-gray-800 rounded-lg " + 
          (animated ? "animate-bounce-subtle" : "")}>
          <Leaf className={sizeClasses.icon + " " + variantClasses.icon + 
            " transition-transform group-hover:scale-110 " + 
            (animated ? "animate-wiggle" : "")} />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <h1 className={"font-bold leading-none tracking-tight " + 
          sizeClasses.text + " " + variantClasses.text + " " + 
          variantClasses.textHover + " transition-colors"}>
          GreenSentinel
        </h1>
        <p className={"text-xs font-medium opacity-75 " + 
          variantClasses.text + " " + variantClasses.textHover + 
          " transition-colors"}>
          Environmental Protection
        </p>
      </div>
    </div>
  );
};

// Logo variants
Logo.Icon = ({ size = 'md', animated = false, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={"relative flex items-center justify-center " + sizes[size] + " " + 
      className + " " + (animated ? "animate-float" : "")}>
      <div className={"absolute inset-0 bg-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity " + 
        (animated ? "animate-pulse" : "")} />
      <div className={"relative p-2 bg-white dark:bg-gray-800 rounded-lg w-full h-full " + 
        (animated ? "animate-bounce-subtle" : "")}>
        <Leaf className={"w-full h-full text-emerald-500 transition-transform group-hover:scale-110 " + 
          (animated ? "animate-wiggle" : "")} />
      </div>
    </div>
  );
};

// Animation styles
const styles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes bounce-subtle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }

  @keyframes wiggle {
    0%, 100% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(5deg);
    }
  }

  .animate-wiggle {
    animation: wiggle 1s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-bounce-subtle,
    .animate-wiggle {
      animation: none;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Logo;
