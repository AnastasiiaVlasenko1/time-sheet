import { Button, Tile, Tag, InlineNotification } from '@carbon/react';
import { Time } from '@carbon/react/icons';

interface ReminderScreenProps {
  onReview: () => void;
}

const ReminderScreen: React.FC<ReminderScreenProps> = ({ onReview }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 48px)',
        flexDirection: 'column',
      }}
    >
      <Tile style={{ maxWidth: 480, width: '100%', padding: '2rem', textAlign: 'center' }}>
        {/* Time icon in circle container */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Time size={32} />
        </div>

        <p style={{ color: 'var(--cds-text-secondary, #525252)', marginBottom: '0.5rem' }}>
          17:00 — Friday, March 13
        </p>

        <h2 style={{ marginBottom: '1rem' }}>Time to log your day</h2>

        <p style={{ marginBottom: '1.5rem' }}>
          AI found 2 meetings, 4.5h of task work, and 1 gap. Takes ~30 seconds.
        </p>

        <InlineNotification
          kind="warning"
          title="2 unfilled days"
          subtitle="Catch up in one go"
          lowContrast
          hideCloseButton
          style={{ marginBottom: '1.5rem' }}
        />

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button kind="primary" onClick={onReview}>
            Review now
          </Button>
          <Button kind="tertiary">Snooze 1h</Button>
        </div>
      </Tile>

      {/* Sync status tags below the tile */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          marginTop: '1.5rem',
        }}
      >
        <Tag type="green" size="sm">
          Calendar synced
        </Tag>
        <Tag type="green" size="sm">
          Jira synced
        </Tag>
        <Tag type="green" size="sm">
          Patterns loaded
        </Tag>
      </div>
    </div>
  );
};

export default ReminderScreen;
