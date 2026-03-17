export function WheelPointer() {
  return (
    <div
      className="absolute top-[-2px] left-1/2 z-10 animate-pointer-bounce"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '28px solid #5b21b6',
          filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}
      />
    </div>
  )
}
