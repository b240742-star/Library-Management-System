
import "./Admin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/adminService";

interface Stats {
    totalUsers: number;
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    issuedBooks: number;
    pendingRequests: number;
    totalFine: number;
}

function Admin() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const inventoryPercent =
        stats && stats.totalCopies > 0
            ? Math.min(
                  100,
                  Math.round(
                      (stats.availableCopies / stats.totalCopies) * 100
                  )
              )
            : 0;

    const metrics = stats
        ? [
              {
                  label: "Book titles",
                  value: stats.totalBooks,
                  note: "Distinct titles in the catalogue"
              },
              {
                  label: "Total copies",
                  value: stats.totalCopies,
                  note: "Across the full collection"
              },
              {
                  label: "Currently on loan",
                  value: stats.issuedBooks,
                  note: "Books issued to readers"
              },
              {
                  label: "Pending requests",
                  value: stats.pendingRequests,
                  note: "Waiting for librarian review"
              },
              {
                  label: "Registered readers",
                  value: stats.totalUsers,
                  note: "Accounts in the system"
              },
              {
                  label: "Fines recorded",
                  value: `₹${stats.totalFine}`,
                  note: "Total recorded fine amount"
              }
          ]
        : [];

    return (
        <main className="editorial-admin">
            <div className="editorial-topline">
                <span>THE LIBRARY DESK</span>
                <span>ADMINISTRATION / OVERVIEW</span>
            </div>

            <header className="editorial-heading">
                <div>
                    <p className="editorial-kicker">
                        A place for every story
                    </p>

                    <h1>
                        Library overview<span>.</span>
                    </h1>

                    <p className="editorial-intro">
                        A considered view of the collection, its readers and
                        the activity that keeps the library moving.
                    </p>
                </div>

                <div className="editorial-date">
                    <span className="editorial-date-mark">L</span>
                    <span>
                        COLLECTION
                        <br />
                        &amp; READER SERVICES
                    </span>
                </div>
            </header>

            {error && (
                <div className="editorial-alert" role="alert">
                    <strong>Dashboard unavailable.</strong> {error}
                </div>
            )}

            {loading && (
                <div className="editorial-loading">
                    Gathering the latest library figures...
                </div>
            )}

            {stats && !loading && (
                <>
                    <section className="editorial-feature">
                        <div className="editorial-feature-copy">
                            <p className="editorial-kicker">
                                01 / The collection
                            </p>

                            <h2>
                                Every book has
                                <br />
                                a place here.
                            </h2>

                            <p>
                                Keep track of the catalogue and see how much
                                of the collection is ready to find its next
                                reader.
                            </p>

                            <button
                                className="editorial-button editorial-button-light"
                                onClick={() => navigate("/manage-books")}
                            >
                                Explore book catalogue
                                <span aria-hidden="true">↗</span>
                            </button>
                        </div>

                        <div className="editorial-inventory">
                            <div className="editorial-inventory-heading">
                                <span>AVAILABLE COLLECTION</span>
                                <span>{inventoryPercent}%</span>
                            </div>

                            <div
                                className="editorial-progress-track"
                                role="progressbar"
                                aria-label="Available copies"
                                aria-valuenow={inventoryPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="editorial-progress-fill"
                                    style={{
                                        width: `${inventoryPercent}%`
                                    }}
                                />
                            </div>

                            <div className="editorial-inventory-numbers">
                                <div>
                                    <strong>{stats.availableCopies}</strong>
                                    <span>Available copies</span>
                                </div>

                                <div>
                                    <strong>
                                        {Math.max(
                                            0,
                                            stats.totalCopies -
                                                stats.availableCopies
                                        )}
                                    </strong>
                                    <span>Not available</span>
                                </div>
                            </div>

                            <p className="editorial-inventory-footnote">
                                Out of {stats.totalCopies} copies in the
                                collection
                            </p>
                        </div>
                    </section>

                    <section className="editorial-section">
                        <div className="editorial-section-heading">
                            <div>
                                <p className="editorial-kicker">
                                    02 / At a glance
                                </p>

                                <h2>Library figures</h2>
                            </div>

                            <p>
                                Current totals from your library records
                            </p>
                        </div>

                        <div className="editorial-metrics">
                            {metrics.map((metric, index) => (
                                <article
                                    className="editorial-metric"
                                    key={metric.label}
                                >
                                    <span className="editorial-metric-index">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <h3>{metric.label}</h3>

                                    <p className="editorial-metric-value">
                                        {metric.value}
                                    </p>

                                    <p className="editorial-metric-note">
                                        {metric.note}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="editorial-bottom">
                        <div>
                            <p className="editorial-kicker">
                                03 / Next steps
                            </p>

                            <h2>Keep things in motion.</h2>

                            <p>
                                Manage the catalogue or review requests that
                                need attention.
                            </p>
                        </div>

                        <div className="editorial-actions">
                            <button
                                className="editorial-button"
                                onClick={() => navigate("/manage-books")}
                            >
                                Manage books
                                <span aria-hidden="true">↗</span>
                            </button>

                            <button
                                className="editorial-button editorial-button-outline"
                                onClick={() => navigate("/librarian")}
                            >
                                Review requests
                                <span aria-hidden="true">↗</span>
                            </button>
                        </div>
                    </section>
                </>
            )}

            <footer className="editorial-footer">
                <span>LIBRARY MANAGEMENT SYSTEM</span>
                <span>BUILT AROUND THE LOVE OF READING</span>
            </footer>
        </main>
    );
}

export default Admin;
