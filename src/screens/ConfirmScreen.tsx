import { Tile, Button } from '@carbon/react';
import { Checkmark } from '@carbon/react/icons';
import type { TimeEntry } from '../types';
import { calcHours, totalHours, billableHours } from '../utils/timeHelpers';
import ProjectDot from '../components/ProjectDot';

interface ConfirmScreenProps {
  entries: TimeEntry[];
  onSubmit: () => void;
  onBack: () => void;
}

const ConfirmScreen: React.FC<ConfirmScreenProps> = ({ entries, onSubmit, onBack }) => {
  const total = totalHours(entries);
  const billable = billableHours(entries);
  const uniqueProjects = entries
    .filter((e) => e.project !== null)
    .reduce<Map<number, { name: string; color: string; hours: number }>>((map, e) => {
      const p = e.project!;
      const existing = map.get(p.id);
      const hours = calcHours(e.start, e.end);
      if (existing) {
        existing.hours = Number((existing.hours + hours).toFixed(1));
      } else {
        map.set(p.id, { name: p.name, color: p.color, hours });
      }
      return map;
    }, new Map());

  const projectCount = uniqueProjects.size;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 48px)',
      }}
    >
      <Tile style={{ maxWidth: 480, width: '100%', padding: '2rem', textAlign: 'center' }}>
        {/* Green checkmark icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#198038',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Checkmark size={32} />
        </div>

        <h2 style={{ marginBottom: '1.5rem' }}>Friday is ready to submit</h2>

        {/* Stats 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <Tile style={{ textAlign: 'center' }}>
            <h3>{total}h</h3>
            <small>total</small>
          </Tile>
          <Tile style={{ textAlign: 'center' }}>
            <h3>{billable}h</h3>
            <small>billable</small>
          </Tile>
          <Tile style={{ textAlign: 'center' }}>
            <h3>{projectCount}</h3>
            <small>projects</small>
          </Tile>
          <Tile style={{ textAlign: 'center' }}>
            <h3>{entries.length}</h3>
            <small>entries</small>
          </Tile>
        </div>

        {/* Project breakdown */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          {Array.from(uniqueProjects.entries()).map(([id, { name, color, hours }]) => (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ProjectDot color={color} />
                <span>{name}</span>
              </div>
              <span style={{ fontWeight: 600 }}>{hours}h</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button kind="primary" onClick={onSubmit} style={{ width: '100%' }}>
            Submit timesheet
          </Button>
          <Button kind="tertiary" onClick={onBack} style={{ width: '100%' }}>
            Back to edit
          </Button>
        </div>
      </Tile>
    </div>
  );
};

export default ConfirmScreen;
